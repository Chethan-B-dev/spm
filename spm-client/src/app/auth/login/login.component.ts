import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EMPTY, Subject } from "rxjs";
import { catchError, pluck, takeUntil } from "rxjs/operators";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { ILoginRequest } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService,
    private readonly managerService: ManagerService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }
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
        pluck("user"),
        catchError(() => EMPTY)
      )
      .subscribe((user) => {
        this.managerService.stateRefresh(user);
        this.employeeService.stateRefresh(user);
        this.snackbarService.showSnackBar(`Welcome ${user.username}`);
        this.router.navigate([`/${user.role.toLowerCase()}`]);
      });
  }
}
