import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EMPTY, Subject, Subscribable, Subscription } from "rxjs";
import { catchError, pluck, takeUntil, tap } from "rxjs/operators";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { ILoginRequest } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService,
    private readonly managerService: ManagerService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  login(): void {
    const loginSubscription = this.authService
      .login(this.loginForm.value as ILoginRequest)
      .pipe(
        takeUntil(this.destroy$),
        pluck("user"),
        tap((user) => {
          this.managerService.stateRefresh(user);
          this.employeeService.stateRefresh(user);
        }),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((user) => {
        this.managerService.stateRefresh(user);
        this.employeeService.stateRefresh(user);
        this.snackbarService.showSnackBar(`Welcome ${user.username}`);
        this.router.navigate([`/${user.role.toLowerCase()}`]);
      });
    this.subscriptions.push(loginSubscription);
  }
}
