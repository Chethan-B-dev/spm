import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Subject, EMPTY } from "rxjs";
import { takeUntil, catchError } from "rxjs/operators";
import { IProject, ProjectStatus, ProjectStatusOptions } from "src/app/shared/interfaces/project.interface";
import { TaskStatus } from "src/app/shared/interfaces/task.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-edit-project",
  templateUrl: "./edit-project.component.html",
  styleUrls: ["./edit-project.component.scss"],
})
export class EditProjectComponent {
  project: IProject;
  editProjectForm: FormGroup;
  projectStatusOptions = ProjectStatusOptions;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA) project
  ) {
    this.project = project;
    this.editProjectForm = this.fb.group({
      name: [this.project.name, Validators.required],
      description: [this.project.description, Validators.required],
      toDate: [this.project.toDate, Validators.required],
      status: [this.project.status, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isProjectOnHold(): boolean {
    return this.project.status === ProjectStatus.ON_HOLD;
  }

  isProjectComplete(): boolean {
    return this.project.tasks.every(task => task.status === TaskStatus.COMPLETED);
  }

  editProject(): void {
    const projectName: string = this.editProjectForm.value.name;
    const projectDescription: string = this.editProjectForm.value.description;
    const projectDeadLine: Date = this.editProjectForm.value.toDate;
    const projectStatus: ProjectStatus = this.editProjectForm.value.status;

    if (new Date().getTime() > new Date(projectDeadLine).getTime()) {
      this.snackbarService.showSnackBar(
        "Project deadline cannot precede current date"
      );
      return;
    }

    if (
      new Date(projectDeadLine).getTime() <
      new Date(this.project.toDate).getTime()
    ) {
      this.snackbarService.showSnackBar(
        "Project deadline can only be extended"
      );
      return;
    }

    this.managerService
      .editProject(
        this.project.id,
        projectName,
        projectDescription,
        projectDeadLine,
        projectStatus
      )
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.close();
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar(
          `${this.project.name} has been edited`
        );
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
