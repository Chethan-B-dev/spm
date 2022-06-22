import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ThemePalette } from "@angular/material/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { combineLatest, EMPTY, Observable, Subject } from "rxjs";
import { catchError, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { ShowEmployeesComponent } from "src/app/manager/dialogs/show-employees/show-employees.component";
import { getIssueProgress } from "src/app/shared/interfaces/issue.interface";
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  getTaskStatistics,
  ITask,
  TaskStatistics,
} from "src/app/shared/interfaces/task.interface";
import { getProjectProgress } from "src/app/shared/interfaces/todo.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { EmployeeService } from "../employee.service";
import { CreateIssueComponent } from "./Dialogs/create-issue/create-issue.component";
export interface ChipColor {
  name: string;
  color: ThemePalette;
}
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
  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = +params.get("id");
    });

    // ! we are refreshing in case we update project information
    this.project$ = this.employeeService.refresh$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.employeeService.getProjectById(this.projectId)),
      tap((project) => {
        this.employeeService.setProject(project);
        this.issueProgress = getIssueProgress(project.issues) || 0;
        this.projectProgress = getProjectProgress(project.tasks) || 0;
        this.projectTaskStatistics = getTaskStatistics(project.tasks);
      }),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

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
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  onTaskCategoryChange(selectedTaskCategory: string): void {
    this.employeeService.selectTaskCategory(selectedTaskCategory);
  }

  toggleShowIssues(): void {
    this.showIssues = !this.showIssues;
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

    this.dialog.open(CreateIssueComponent, dialogConfig);
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
