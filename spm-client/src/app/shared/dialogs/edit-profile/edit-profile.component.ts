import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EMPTY, Observable, Subject, Subscription } from "rxjs";
import { catchError, finalize, switchMap, takeUntil } from "rxjs/operators";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileComponent implements OnInit, OnDestroy {
  editProfileForm: FormGroup;
  currentUser = this.authService.currentUser;
  file: File;
  uploadPercent: Observable<number>;
  disableButton = false;
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storage: AngularFireStorage,
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
      image: [null],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onFileChange(event) {
    this.file = (event.target.files as FileList).item(0);
  }

  editProfile(): void {
    const isImageChanged = !!this.file;
    this.disableButton = true;
    if (isImageChanged) {
      const fileType = this.file.type;
      if (!fileType.startsWith("image/")) {
        this.snackbarService.showSnackBar("Only Images can be uploaded");
        return;
      }
      const filePath = `/profile/${this.currentUser.email}_${this.currentUser.id}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);
      this.uploadPercent = task.percentageChanges();
      this.subscriptions.push(
        task
          .snapshotChanges()
          .pipe(
            takeUntil(this.destroy$),
            catchError((err) => {
              this.snackbarService.showSnackBar(err);
              this.disableButton = false;
              return EMPTY;
            }),
            finalize(() => {
              this.subscriptions.push(
                fileRef
                  .getDownloadURL()
                  .pipe(
                    switchMap((imageUrl: string) =>
                      this.changeProfile(imageUrl)
                    )
                  )
                  .subscribe(() => {
                    this.currentUser = this.authService.currentUser;
                    this.snackbarService.showSnackBar(
                      "profile has been edited"
                    );
                    this.router.navigate(["/"]);
                    this.disableButton = false;
                  })
              );
            })
          )
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        this.changeProfile(null).subscribe(() => {
          this.snackbarService.showSnackBar("profile has been edited");
          this.disableButton = false;
        })
      );
    }
  }

  changeProfile(imageUrl: string | null): Observable<IAppUser> {
    this.editProfileForm.value.image = imageUrl;
    return this.authService
      .editProfile({
        ...this.editProfileForm.value,
      } as IEditProfileRequest)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      );
  }

  private isImportant(currentUser: IAppUser): boolean {
    return currentUser.role !== UserRole.EMPLOYEE;
  }
}
