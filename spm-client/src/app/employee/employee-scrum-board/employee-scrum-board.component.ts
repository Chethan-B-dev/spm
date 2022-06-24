import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { ITask, TaskStatus } from "src/app/shared/interfaces/task.interface";
import {
  getTodoStatistics,
  ITodo,
  TodoStatistics,
  TodoStatus,
} from "src/app/shared/interfaces/todo.interface";
import { UserRole } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-employee-scrum-board",
  templateUrl: "./employee-scrum-board.component.html",
  styleUrls: ["./employee-scrum-board.component.scss"],
})
export class EmployeeScrumBoardComponent implements OnInit, OnDestroy {
  taskId: number;
  task$: Observable<ITask>;
  canDrag: boolean;
  private readonly currentUser = this.authService.currentUser;
  private readonly destroy$ = new Subject<void>();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => (this.taskId = +params.get("id"))
    );

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
      task.todos.length !== 0 &&
      task.status === TaskStatus.IN_PROGRESS &&
      task.todos.every((todo) => todo.status === TodoStatus.DONE)
    );
  }

  completeTask(taskId: number): void {
    this.employeeService
      .completeTask(taskId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar(`This task has been completed`);
        this.canDrag = false;
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
}
