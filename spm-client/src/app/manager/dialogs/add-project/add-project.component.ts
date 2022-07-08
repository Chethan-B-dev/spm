import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
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
  createProjectForm: FormGroup;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService
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
    const projectName: string = this.createProjectForm.value.name;
    const projectDescription: string = this.createProjectForm.value.description;
    const projectDeadLine: Date = this.createProjectForm.value.toDate;

    if (new Date().getTime() > projectDeadLine.getTime()) {
      this.snackbarService.showSnackBar(
        "Project deadline cannot precede current date"
      );
      return;
    }

    this.managerService
      .createProject(projectName, projectDescription, projectDeadLine)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.close();
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar(`${projectName} has been created`);
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
