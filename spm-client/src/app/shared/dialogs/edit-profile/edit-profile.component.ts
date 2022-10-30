import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import {
  catchError,
  finalize,
  switchMap,
  take,
  takeUntil,
} from "rxjs/operators";
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
  disableButton = false;
  editProfileForm: FormGroup;
  file: File;
  uploadPercent$: Observable<number>;

  private readonly currentUserSubject = new BehaviorSubject<IAppUser>(
    this.authService.currentUser
  );
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly storage: AngularFireStorage,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.disableButton = false;
          return EMPTY;
        })
      )
      .subscribe((currentUser) => {
        this.currentUserSubject.next(currentUser);
        this.setProfileForm(currentUser);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.currentUserSubject.complete();
  }

  onFileChange(event): void {
    this.file = (event.target.files as FileList).item(0);
  }

  goBack(): void {
    this.router.navigate(["/"]);
  }

  editProfile(): void {
    const isImageChanged = !!this.file;
    this.disableButton = true;
    if (isImageChanged) {
      this.performFileUpload();
    } else {
      this.changeProfile().subscribe(() => {
        this.snackbarService.showSnackBar("profile has been edited");
        this.disableButton = false;
      });
    }
  }

  private performFileUpload() {
    if (!this.file.type.startsWith("image/")) {
      this.snackbarService.showSnackBar("Only Images can be uploaded");
      return;
    }
    const currentUser = this.currentUserSubject.getValue();
    const filePath = `/profile/${currentUser.email}_${currentUser.id}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.file);
    this.uploadPercent$ = task.percentageChanges();
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
          fileRef
            .getDownloadURL()
            .pipe(
              takeUntil(this.destroy$),
              switchMap((imageUrl: string) => this.changeProfile(imageUrl))
            )
            .subscribe(() => {
              this.snackbarService.showSnackBar("profile has been edited");
              this.router.navigate(["/"]);
              this.disableButton = false;
            });
        })
      )
      .subscribe();
  }

  private changeProfile(imageUrl?: string): Observable<IAppUser> {
    this.editProfileForm.value.image = imageUrl || null;
    return this.authService
      .editProfile({
        ...this.editProfileForm.value,
      } as IEditProfileRequest)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.disableButton = false;
          return EMPTY;
        })
      );
  }

  private isImportant(currentUser: IAppUser): boolean {
    return currentUser.role !== UserRole.EMPLOYEE;
  }

  private setProfileForm(currentUser: IAppUser): void {
    if (!currentUser) {
      return;
    }

    this.editProfileForm = this.fb.group({
      email: [
        { value: currentUser.email, disabled: true },
        Validators.required,
      ],
      username: [currentUser.username || "", Validators.required],
      phone: [currentUser.phone || "", Validators.required],
      designation: this.isImportant(currentUser)
        ? [
            {
              value: currentUser.designation || "",
              disabled: true,
            },
          ]
        : [currentUser.designation || ""],
      image: [null],
    });
  }
}
