import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { ITaskRequestDTO } from "src/app/shared/interfaces/task.interface";
import { NotificationService } from "src/app/shared/notification.service";
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
  private readonly destroy$ = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) project,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
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
    const taskRequestDTO = this.createTaskForm.value as ITaskRequestDTO;

    if (taskRequestDTO.deadLine.getTime() < new Date().getTime()) {
      this.snackbarService.showSnackBar(
        "Task deadline cannot precede current date"
      );
      return;
    }

    if (
      taskRequestDTO.deadLine.getTime() >
      new Date(this.project.toDate).getTime()
    ) {
      this.snackbarService.showSnackBar(
        "Task deadline cannot exceed project deadline"
      );
      return;
    }

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
      .subscribe(() => {
        const notification: INotification = {
          userId: taskRequestDTO.userId,
          notification: `A new Task: '${
            taskRequestDTO.name
          }' has been assigned to you on ${new Date().toLocaleString()}`,
          time: Date.now(),
        };
        this.notificationService.addNotification(notification);
        this.snackbarService.showSnackBar("Task has been created");
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
