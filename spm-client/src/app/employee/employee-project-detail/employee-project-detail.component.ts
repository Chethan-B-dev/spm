import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, EMPTY, Observable, Subject } from "rxjs";
import {
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { ShowEmployeesComponent } from "src/app/manager/dialogs/show-employees/show-employees.component";
import { ImageSliderComponent } from "src/app/shared/dialogs/image-slider/image-slider.component";
import {
  getIssueProgress,
  getIssueStatistics,
  IIssue,
  IssueStatus,
  sortIssuesByPriority,
} from "src/app/shared/interfaces/issue.interface";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  getTaskStatistics,
  ITask,
  sortTasksByPriority,
  TaskStatistics,
} from "src/app/shared/interfaces/task.interface";
import { getProjectProgress } from "src/app/shared/interfaces/todo.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import {
  goBack,
  sendProjectApproachingDeadlineNotification,
} from "src/app/shared/utility/common";
import { EmployeeService } from "../employee.service";
import { TaskStatus } from "./../../shared/interfaces/task.interface";
import { CreateIssueComponent } from "./Dialogs/create-issue/create-issue.component";

@Component({
  selector: "app-employee-project-detail",
  templateUrl: "./employee-project-detail.component.html",
  styleUrls: ["./employee-project-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeProjectDetailComponent implements OnInit, OnDestroy {
  readonly defaultTaskCategory = TaskStatus.ALL;
  projectProgress: number;
  projectTaskStatistics: TaskStatistics;
  showIssues = false;
  issueProgress: number;
  project$: Observable<IProject>;
  tasks$: Observable<ITask[]>;
  private currentUser = this.authService.currentUser;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const projectId$ = this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map((params) => +params.get("id"))
    );

    this.project$ = this.employeeService.refresh$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(projectId$),
      switchMap(([_, projectId]) =>
        this.employeeService.getProjectById(projectId)
      ),
      tap((project) => {
        this.employeeService.setProject(project);
        this.issueProgress = getIssueProgress(project.issues) || 0;
        this.projectProgress = getProjectProgress(project.tasks) || 0;
        this.projectTaskStatistics = getTaskStatistics(project.tasks);
        sendProjectApproachingDeadlineNotification.call(this, project);
      }),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    this.employeeService.selectTaskCategory(this.defaultTaskCategory);

    this.tasks$ = combineLatest(
      this.employeeService.tasks$,
      this.employeeService.taskCategorySelectedAction$
    ).pipe(
      takeUntil(this.destroy$),
      map(([tasks, selectedTaskCategory]) =>
        selectedTaskCategory === TaskStatus.ALL
          ? tasks
          : tasks.filter((task) => task.status === selectedTaskCategory)
      ),
      map((tasks) => tasks.sort(sortTasksByPriority)),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  sortIssues(issues: IIssue[]): IIssue[] {
    return issues.sort(sortIssuesByPriority);
  }

  onTaskCategoryChange(selectedTaskCategory: string): void {
    this.employeeService.selectTaskCategory(selectedTaskCategory);
  }

  toggleShowIssues(): void {
    this.showIssues = !this.showIssues;
  }

  goBack(): void {
    goBack();
  }

  getIssueKey(projectName: string, issueId: number): string {
    return projectName.substring(0, 4) + "-" + issueId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createIssue(project: IProject): void {
    const dialogConfig = new MatDialogConfig<IProject>();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = project;

    const dialogRef = this.dialog.open(CreateIssueComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((createdIssue: boolean) => {
        if (createdIssue) {
          const managerId = project.manager.id;
          const notification: INotification = {
            userId: managerId,
            notification: `An Issue was raised for project '${
              project.name
            }' by '${
              this.currentUser.username
            }' on ${new Date().toLocaleString()}`,
            time: Date.now(),
          };
          this.notificationService.addNotification(notification);
        }
      });
  }

  getIssueStats(issues: IIssue[]): string {
    const issueStatistics = getIssueStatistics(issues);
    return `${issueStatistics[IssueStatus.RESOLVED]} / ${issues.length}`;
  }

  openProjectFilesDialog(project: IProject): void {
    const files = JSON.parse(project.files) as string[];
    if (!files || !files.length) {
      this.snackbarService.showSnackBar("There are no files for this project");
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80vw";
    dialogConfig.height = "40vw";
    dialogConfig.data = project;

    this.dialog.open(ImageSliderComponent, dialogConfig);
  }

  openShowEmployeesDialog(project: IProject): void {
    if (!project.users.length) {
      this.snackbarService.showSnackBar(
        "There are no Employees in this project"
      );
      return;
    }

    const dialogConfig = new MatDialogConfig<IProject>();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = project;

    this.dialog.open(ShowEmployeesComponent, dialogConfig);
  }
}
