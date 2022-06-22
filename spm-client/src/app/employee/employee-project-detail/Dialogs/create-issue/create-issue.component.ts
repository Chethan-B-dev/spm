import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { EmployeeService } from "src/app/employee/employee.service";
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
  private readonly destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createIssue(projectId: number): void {
    this.employeeService
      .createIssue(projectId, this.createIssueForm.value)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.close();
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar("issue has been created");
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
