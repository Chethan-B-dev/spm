import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  createProjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private managerService: ManagerService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.createProjectForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      toDate: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createProject(): void {
    if (this.createProjectForm.invalid) return;
    let projectName: string = this.createProjectForm.value.name;
    let projectDescription: string = this.createProjectForm.value.description;
    let projectDeadLine: Date = this.createProjectForm.value.toDate;
    this.managerService
      .createProject(projectName, projectDescription, projectDeadLine)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar("Project has been created");
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
