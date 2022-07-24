import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EMPTY, Subject, Subscription } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import {
  IAppUser,
  IEditProfileRequest,
  UserRole,
} from "../../interfaces/user.interface";
import { SnackbarService } from "../../services/snackbar.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  editProfileForm: FormGroup;
  currentUser = this.authService.currentUser;
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.editProfileForm = this.fb.group({
      email: [
        { value: this.currentUser.email, disabled: true },
        Validators.required,
      ],
      username: [this.currentUser.username || "", Validators.required],
      phone: [this.currentUser.phone || "", Validators.required],
      designation: this.isImportant(this.currentUser)
        ? [
            {
              value: this.currentUser.designation || "",
              disabled: true,
            },
          ]
        : [this.currentUser.designation || ""],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  editProfile(): void {
    const editProfileSubscription = this.authService
      .editProfile({
        ...this.editProfileForm.value,
      } as IEditProfileRequest)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((user) => {
        this.currentUser = user;
        this.snackbarService.showSnackBar(`Your profile has been updated`);
      });
    this.subscriptions.push(editProfileSubscription);
  }

  private isImportant(currentUser: IAppUser): boolean {
    return currentUser.role !== UserRole.EMPLOYEE;
  }
}
