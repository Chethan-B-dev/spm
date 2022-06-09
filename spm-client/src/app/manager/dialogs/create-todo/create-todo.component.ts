import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-create-todo",
  templateUrl: "./create-todo.component.html",
  styleUrls: ["./create-todo.component.scss"],
})
export class CreateTodoComponent implements OnInit, OnDestroy {
  createTodoForm: FormGroup;
  taskId: number;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTodoComponent>,
    @Inject(MAT_DIALOG_DATA) taskId,
    private managerService: ManagerService,
    private snackbarService: SnackbarService
  ) {
    this.taskId = taskId;
  }

  ngOnInit(): void {
    this.createTodoForm = this.fb.group({
      todo: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createTodo(): void {
    this.managerService
      .createTodo(this.createTodoForm.value, this.taskId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.close();
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar("Todo has been created");
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
