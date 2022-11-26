// angular
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

// rxjs
import { EMPTY, Observable, of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";

// components
import { CreateTaskComponent } from "src/app/manager/dialogs/create-task/create-task.component";
import { EditProjectComponent } from "src/app/manager/dialogs/edit-project/edit-project.component";
import { SetDesignationComponent } from "src/app/manager/dialogs/set-designation/set-designation.component";
import { ShowEmployeesComponent } from "src/app/manager/dialogs/show-employees/show-employees.component";
import { ImageSliderComponent } from "../dialogs/image-slider/image-slider.component";

// services
import { ManagerService } from "src/app/manager/services/manager.service";
import { NotificationService } from "../services/notification.service";
import { SnackbarService } from "../services/snackbar.service";

// interfaces
import { IIssue } from "../interfaces/issue.interface";
import { INotification } from "../interfaces/notification.interface";
import { IProject, ProjectStatus } from "../interfaces/project.interface";
import {
  getTaskStatistics,
  TaskStatistics,
} from "../interfaces/task.interface";
import { getProjectProgress } from "../interfaces/todo.interface";
import { IAppUser } from "../interfaces/user.interface";

// utility
import { Router } from "@angular/router";
import { DataType, PieData } from "../utility/common";

@Component({
  selector: "app-project-card",
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.scss"],
})
export class ProjectCardComponent implements OnInit, OnDestroy {
  @Input() project: IProject;
  @Input() showAddTask = false;
  @Input() showBackButton = false;
  @Input() showAddEmps = false;
  @Input() showIssueStats = false;
  @Input() showViewDetailsButton = true;
  @Input() showEditProject = false;
  @Input() showProjectFiles = false;
  @Output() showIssues = new EventEmitter<void>();
  users$?: Observable<IAppUser[]> | undefined;
  employees: IAppUser[] = [];
  projectProgress: number;
  projectTaskStatistics: TaskStatistics;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
  ) {}

  get pieChartData(): PieData<IIssue> {
    return {
      type: DataType.ISSUE,
      data: this.project.issues,
    } as PieData<IIssue>;
  }

  ngOnInit(): void {
    if (this.showAddEmps) {
      this.users$ = this.managerService.refresh$.pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.managerService.getAllEmployees(this.project.id)),
        catchError(() => EMPTY)
      );
    }
    this.projectProgress = getProjectProgress(this.project.tasks);
    this.projectTaskStatistics = getTaskStatistics(this.project.tasks);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  toggleShowIssues(): void {
    this.showIssues.emit();
  }

  addEmployees(): void {
    if (!this.employees.length) {
      this.snackbarService.showSnackBar("Please add Employees before syncing");
      return;
    }

    const employeesWithoutDesignation = this.employees.filter(
      (employee) => !employee.designation
    );

    this.openSetDesignationDialog(employeesWithoutDesignation).subscribe(
      (designationsSet) => {
        if (designationsSet) {
          this.addEmployeesToProject();
        } else {
          this.snackbarService.showSnackBar(
            "Something went wrong could not Add Employees to Project"
          );
          this.employees = [];
        }
      }
    );
  }

  goBack(): void {
    this.router.navigate(["/"]);
  }

  showNoEmployeesSnackbar(): void {
    this.snackbarService.showSnackBar(
      "There are no more employees for you to add"
    );
  }

  openCreateTaskDialog(): void {
    if (!this.project.users.length) {
      this.snackbarService.showSnackBar(
        "Please Add Employees to the project before creating tasks"
      );
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.project;

    this.dialog.open(CreateTaskComponent, dialogConfig);
  }

  openEditProjectDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.project;

    this.dialog.open(EditProjectComponent, dialogConfig);
  }

  openProjectFilesDialog(): void {
    const files = (JSON.parse(this.project.files) as string[]) || [];

    if (!files.length) {
      this.snackbarService.showSnackBar("There are no files for this project");
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80vw";
    dialogConfig.height = "40vw";
    dialogConfig.data = this.project;

    this.dialog.open(ImageSliderComponent, dialogConfig);
  }

  openSetDesignationDialog(employees: IAppUser[]): Observable<boolean> {
    if (!employees.length) {
      return of(true);
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { employees, manager: this.project.manager };

    const dialogRef = this.dialog.open(SetDesignationComponent, dialogConfig);

    return dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  openShowEmployeesDialog(): void {
    if (!this.project.users.length) {
      this.snackbarService.showSnackBar(
        "Please Add Employees to the project first"
      );
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.project;

    this.dialog.open(ShowEmployeesComponent, dialogConfig);
  }

  showAddTaskButton(): boolean {
    const isProjectExpired =
      new Date().getTime() > new Date(this.project.toDate).getTime();
    const isProjectInProgress =
      this.project.status === ProjectStatus.IN_PROGRESS;
    return isProjectInProgress && !isProjectExpired;
  }

  private sendProjectAssignmentNotifications() {
    this.employees.forEach((employee) => {
      const notification: INotification = {
        userId: employee.id,
        notification: `You have been assigned to the project '${
          this.project.name
        }' by Manager: ${
          this.project.manager.username
        } on ${new Date().toLocaleString()}`,
        time: Date.now(),
      };
      this.notificationService.addNotification(notification);
    });
  }

  private addEmployeesToProject(): void {
    this.managerService
      .addEmployees(this.project.id, this.employees)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => EMPTY)
      )
      .subscribe(() => {
        this.sendProjectAssignmentNotifications();
        this.snackbarService.showSnackBar("Employees have been added");
        this.employees = [];
      });
  }
}
