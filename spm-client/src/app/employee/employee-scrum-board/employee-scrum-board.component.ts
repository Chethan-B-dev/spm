import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import { ITask, TaskStatus } from "src/app/shared/interfaces/task.interface";
import {
  getTodoStatistics,
  ITodo,
  TodoStatistics,
  TodoStatus,
} from "src/app/shared/interfaces/todo.interface";
import { IAppUser, UserRole } from "src/app/shared/interfaces/user.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { SharedService } from "src/app/shared/shared.service";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-employee-scrum-board",
  templateUrl: "./employee-scrum-board.component.html",
  styleUrls: ["./employee-scrum-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeScrumBoardComponent implements OnInit, OnDestroy {
  taskId: number;
  manager: IAppUser;
  canDrag: boolean;
  task$: Observable<ITask>;
  private readonly currentUser = this.authService.currentUser;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.taskId = +params.get("id");
      this.getManager();
    });

    this.task$ = this.employeeService.refresh$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.employeeService.getTaskById(this.taskId)),
      tap((task) => (this.canDrag = task.status === TaskStatus.IN_PROGRESS)),
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

  getStats(todos: ITodo[]): TodoStatistics {
    return getTodoStatistics(todos);
  }

  canMarkAsCompleted(task: ITask): boolean {
    return (
      this.currentUser.role == UserRole.EMPLOYEE &&
      task.todos.length > 0 &&
      task.status === TaskStatus.IN_PROGRESS &&
      task.todos.every((todo) => todo.status === TodoStatus.DONE)
    );
  }

  completeTask(task: ITask): void {
    this.employeeService
      .completeTask(task.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.sendTaskCompletedNotification(task);
        this.snackbarService.showSnackBar("This task has been completed");
        this.canDrag = false;
        window.location.reload();
      });
  }

  getTodoStats(todos: ITodo[]): {
    percentage: number;
    fraction: string;
  } {
    const todoStatistics = getTodoStatistics(todos);
    const percentage =
      ((todoStatistics[TodoStatus.DONE] / todos.length) * 100) | 0;
    return {
      percentage,
      fraction: `${todoStatistics[TodoStatus.DONE]} / ${todos.length}`,
    };
  }

  private async getManager() {
    const manager$ = this.sharedService.getManagerOfTask(this.taskId).pipe(
      take(1),
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
    this.manager = await manager$.toPromise();
  }

  private sendTaskCompletedNotification(task: ITask): void {
    const notification: INotification = {
      userId: this.manager.id,
      notification: `Task '${task.name}' was completed by '${
        task.user.username
      }' on ${new Date().toLocaleString()}`,
      time: Date.now(),
    };
    this.notificationService.addNotification(notification);
  }
}
