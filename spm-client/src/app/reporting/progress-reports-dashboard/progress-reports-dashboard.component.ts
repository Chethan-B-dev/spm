import { Component, OnDestroy, OnInit } from "@angular/core";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { ITask } from "src/app/shared/interfaces/task.interface";
import { getProjectProgress } from "src/app/shared/interfaces/todo.interface";
import { IAppUser, UserRole } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-progress-reports-dashboard",
  templateUrl: "./progress-reports-dashboard.component.html",
  styleUrls: ["./progress-reports-dashboard.component.scss"],
})
export class ProgressReportsDashboardComponent implements OnInit, OnDestroy {
  currentUser: IAppUser;
  projects$: Observable<IProject[]>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.currentUser = user));

    const userProjects$ =
      this.currentUser.role === UserRole.MANAGER
        ? this.managerService.projects$
        : this.employeeService.projects$;

    this.projects$ = userProjects$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  getProjectProgress(tasks: ITask[]): number {
    return getProjectProgress(tasks) || 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
