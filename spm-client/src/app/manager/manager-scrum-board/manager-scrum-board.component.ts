import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import { ITask, TaskStatus } from "src/app/shared/interfaces/task.interface";
import {
  getTodoStatistics,
  ITodo,
  TodoStatus,
} from "src/app/shared/interfaces/todo.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { goBack } from "src/app/shared/utility/common";
import { CreateTodoComponent } from "../dialogs/create-todo/create-todo.component";
import { ManagerService } from "../services/manager.service";

@Component({
  selector: "app-manager-scrum-board",
  templateUrl: "./manager-scrum-board.component.html",
  styleUrls: ["./manager-scrum-board.component.scss"],
})
export class ManagerScrumBoardComponent implements OnInit, OnDestroy {
  taskId: number;
  task$: Observable<ITask>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => (this.taskId = +params.get("taskId"))
    );

    this.task$ = this.managerService.refresh$.pipe(
      switchMap(() => this.managerService.getTaskById(this.taskId)),
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    goBack();
  }

  createTodo(task: ITask): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.taskId;

    this.dialog.open(CreateTodoComponent, dialogConfig);

    const notification: INotification = {
      userId: task.user.id,
      notification: `A new Todo for your task ${
        task.name
      } has been added on ${new Date().toLocaleString()}`,
      time: Date.now(),
    };
    this.notificationService.addNotification(notification);
  }

  getCompletedPercentage(todos: ITodo[]): number {
    const todoStatistics = getTodoStatistics(todos);
    return ((todoStatistics[TodoStatus.DONE] / todos.length) * 100) | 0;
  }

  isTaskCompleted(task: ITask): boolean {
    return task.status === TaskStatus.COMPLETED;
  }
}
