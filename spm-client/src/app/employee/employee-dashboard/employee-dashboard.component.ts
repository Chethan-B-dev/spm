import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { stopLoading } from "src/app/shared/utility/loading";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-employee-dashboard",
  templateUrl: "./employee-dashboard.component.html",
  styleUrls: ["./employee-dashboard.component.scss"],
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  currentUser = this.authService.currentUser;
  projects$: Observable<IProject[]>;
  users$: Observable<IAppUser[]>;
  error: string;
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.employeeService.projects$.pipe(
      takeUntil(this.destroy$),
      tap((_) => stopLoading(this.isLoadingSubject)),
      catchError((err) => {
        stopLoading(this.isLoadingSubject);
        this.snackbarService.showSnackBar(err);
        this.error = err;
        return EMPTY;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
