import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import {
  ILoginRequest,
  ILoginResponse,
  UserRole,
} from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService,
    private readonly managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.authService
      .login(this.loginForm.value as ILoginRequest)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.managerService.stateRefresh();
          this.employeeService.stateRefresh();
        }),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((response: ILoginResponse) => {
        const user = response.user;
        this.snackbarService.showSnackBar(`Welcome ${user.username}`);
        switch (user.role) {
          case UserRole.MANAGER:
            this.router.navigate(["/manager"]);
            break;
          case UserRole.EMPLOYEE:
            this.router.navigate(["/employee"]);
            break;
          case UserRole.ADMIN:
            this.router.navigate(["/admin"]);
            break;
          default:
            this.router.navigate(["/login"]);
            break;
        }
      });
  }
}
