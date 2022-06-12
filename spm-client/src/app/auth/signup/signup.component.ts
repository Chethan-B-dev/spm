import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import {
  IAppUser,
  ISignUpRequest,
} from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      userRole: ["", Validators.required],
      phone: ["", Validators.required],
    });
  }

  signup(): void {
    this.authService
      .signup(this.signupForm.value as ISignUpRequest)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((user: IAppUser) => {
        this.snackbarService.showSnackBar(
          "Your account has been created, Please wait for the Admin to approve your request",
          5000
        );
        this.router.navigate(["/login"]);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
