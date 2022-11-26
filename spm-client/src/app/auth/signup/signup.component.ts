import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import { ISignUpRequest } from "src/app/shared/interfaces/user.interface";
import { NotificationService } from "src/app/shared/services/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { myTitleCase } from "src/app/shared/utility/common";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }
    this.signupForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      userRole: ["", Validators.required],
      phone: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  signup(): void {
    this.authService
      .signup(this.signupForm.value as ISignUpRequest)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => EMPTY)
      )
      .subscribe(async (user) => {
        try {
          const admin = await this.sharedService.getAdmin().toPromise();
          const notification: INotification = {
            userId: admin.id,
            notification: `A new ${myTitleCase(user.role)} with name ${
              user.username
            } has registered on ${new Date().toLocaleString()}`,
            time: Date.now(),
          };
          this.notificationService.addNotification(notification);
        } catch (error) {
          console.error(error);
          this.snackbarService.showSnackBar(
            "A notification to the admin could not be sent",
            2000
          );
        } finally {
          this.snackbarService.showSnackBar(
            "Your account has been created, Please wait for the Admin to approve your request",
            5000
          );
          this.router.navigate(["/login"]);
        }
      });
  }
}
