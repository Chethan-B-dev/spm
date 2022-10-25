import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import {
  catchError,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerScrumBoardComponent implements OnInit, OnDestroy {
  task$: Observable<ITask>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const taskId$ = this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map((params) => +params.get("taskId"))
    );

    this.task$ = this.managerService.refresh$.pipe(
      withLatestFrom(taskId$),
      takeUntil(this.destroy$),
      switchMap(([_, taskId]) => this.managerService.getTaskById(taskId)),
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
    dialogConfig.data = task.id;

    this.dialog
      .open(CreateTodoComponent, dialogConfig)
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((todoCreated: boolean) => {
        if (todoCreated) {
          this.sendTodoNotification(task);
        }
      });
  }

  getCompletedPercentage(todos: ITodo[]): number {
    const todoStatistics = getTodoStatistics(todos);
    return ((todoStatistics[TodoStatus.DONE] / todos.length) * 100) | 0;
  }

  isTaskCompleted(task: ITask): boolean {
    return task.status === TaskStatus.COMPLETED;
  }

  private sendTodoNotification(task: ITask) {
    const notification: INotification = {
      userId: task.user.id,
      notification: `A new Todo for your task ${
        task.name
      } has been added on ${new Date().toLocaleString()}`,
      time: Date.now(),
    };
    this.notificationService.addNotification(notification);
  }
}
