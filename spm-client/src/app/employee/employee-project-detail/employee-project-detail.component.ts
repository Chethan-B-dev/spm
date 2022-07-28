import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { combineLatest, EMPTY, Observable, Subject } from "rxjs";
import { catchError, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { ShowEmployeesComponent } from "src/app/manager/dialogs/show-employees/show-employees.component";
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
import { sendProjectApproachingDeadlineNotification } from "src/app/shared/utility/common";
import { EmployeeService } from "../employee.service";
import { CreateIssueComponent } from "./Dialogs/create-issue/create-issue.component";

@Component({
  selector: "app-employee-project-detail",
  templateUrl: "./employee-project-detail.component.html",
  styleUrls: ["./employee-project-detail.component.scss"],
})
export class EmployeeProjectDetailComponent implements OnInit, OnDestroy {
  defaultTaskCategory = "ALL";
  projectProgress: number;
  projectTaskStatistics: TaskStatistics;
  showIssues = false;
  issueProgress: number;
  project$: Observable<IProject>;
  tasks$: Observable<ITask[]>;
  private projectId: number;
  private currentUser = this.authService.currentUser;
  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = +params.get("id");
      this.employeeService.refresh();
    });

    this.project$ = this.employeeService.refresh$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.employeeService.getProjectById(this.projectId)),
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

    // todo: add pagination to this stream and scan to add more elements
    this.tasks$ = combineLatest(
      this.employeeService.tasks$,
      this.employeeService.taskCategorySelectedAction$
    ).pipe(
      takeUntil(this.destroy$),
      map(([tasks, selectedTaskCategory]) =>
        selectedTaskCategory === "ALL"
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
    window.history.go(-1);
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

    dialogRef.afterClosed().subscribe((createdIssue: boolean) => {
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
