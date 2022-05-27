import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { ITaskRequestDTO } from "src/app/shared/interfaces/task.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: ["./create-task.component.scss"],
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  createTaskForm: FormGroup;
  project: IProject;
  readonly destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private managerService: ManagerService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) project
  ) {
    this.project = project;
  }

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      deadLine: ["", Validators.required],
      userId: ["", Validators.required],
      priority: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showNoEmployeesSnackbar(): void {
    this.snackbarService.showSnackBar(
      "Please add Employees to the project before assigning them to a task"
    );
  }

  createTask(): void {
    const taskRequestDTO: ITaskRequestDTO = this.createTaskForm.value;
    this.managerService
      .createTask(taskRequestDTO, this.project.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.close();
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar("Task has been created");
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
