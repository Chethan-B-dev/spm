import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EMPTY, Subject, Subscription } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import { ISignUpRequest } from "src/app/shared/interfaces/user.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { SharedService } from "src/app/shared/shared.service";
import { myTitleCase } from "src/app/shared/utility/common";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      userRole: ["", Validators.required],
      phone: ["", Validators.required],
    });
  }

  signup(): void {
    const registerSubscription = this.authService
      .signup(this.signupForm.value as ISignUpRequest)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((user) => {
        // todo: this is not working try this again
        this.sharedService
          .getAdmin()
          .pipe(
            takeUntil(this.destroy$),
            catchError((err) => {
              this.snackbarService.showSnackBar(err);
              return EMPTY;
            })
          )
          .subscribe((admin) => {
            const notification: INotification = {
              userId: admin.id,
              notification: `A new ${myTitleCase(user.role)} with name ${
                user.username
              } has registered on ${new Date().toLocaleString()}`,
              time: Date.now(),
            };
            this.notificationService.addNotification(notification);
          });
        this.snackbarService.showSnackBar(
          "Your account has been created, Please wait for the Admin to approve your request",
          5000
        );
        this.router.navigate(["/login"]);
      });
    this.subscriptions.push(registerSubscription);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
