import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EMPTY, Observable, Subject, Subscription } from "rxjs";
import { catchError, finalize, switchMap, takeUntil } from "rxjs/operators";
import { EmployeeService } from "src/app/employee/employee.service";
import {
  ICreateIssueDTO,
  IIssue,
} from "src/app/shared/interfaces/issue.interface";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
@Component({
  selector: "app-create-issue",
  templateUrl: "./create-issue.component.html",
  styleUrls: ["./create-issue.component.scss"],
})
export class CreateIssueComponent implements OnInit, OnDestroy {
  createIssueForm: FormGroup;
  project: IProject;
  file: File;
  uploadPercent: Observable<number>;
  disableButton = false;
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private dialogRef: MatDialogRef<CreateIssueComponent>,
    @Inject(MAT_DIALOG_DATA) project,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService
  ) {
    this.project = project;
  }

  ngOnInit(): void {
    this.createIssueForm = this.fb.group({
      summary: ["", Validators.required],
      priority: ["", Validators.required],
      image: ["", Validators.required],
    });
  }

  onFileChange(event) {
    this.file = (event.target.files as FileList).item(0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  createIssue(projectId: number): void {
    const fileType = this.file.type;
    if (!fileType.startsWith("image/")) {
      this.snackbarService.showSnackBar("Only Images can be uploaded");
      return;
    }
    this.disableButton = true;
    const filePath = `/issues/${this.file.name}_${Date.now()}`;
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
            this.close(false);
            return EMPTY;
          }),
          finalize(() => {
            this.subscriptions.push(
              fileRef
                .getDownloadURL()
                .pipe(
                  switchMap((imageUrl) => this.addIssue(projectId, imageUrl))
                )
                .subscribe(() => {
                  this.snackbarService.showSnackBar("issue has been created");
                  this.close(true);
                })
            );
          })
        )
        .subscribe()
    );
  }

  addIssue(projectId: number, image: string): Observable<IIssue> {
    const createIssueDTO: ICreateIssueDTO = {
      summary: this.createIssueForm.value.summary,
      priority: this.createIssueForm.value.priority,
      image,
    };
    return this.employeeService.createIssue(projectId, createIssueDTO).pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        this.disableButton = false;
        this.close(false);
        return EMPTY;
      })
    );
  }

  close(createdIssue: boolean): void {
    this.dialogRef.close(createdIssue);
  }
}
