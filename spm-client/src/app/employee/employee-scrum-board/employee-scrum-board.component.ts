import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { ITask } from "src/app/shared/interfaces/task.interface";
import {
  getTodoStatistics,
  ITodo,
  TodoStatistics,
  TodoStatus,
} from "src/app/shared/interfaces/todo.interface";
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
  private readonly destroy$ = new Subject<void>();
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params: ParamMap) => (this.taskId = +params.get("id"))
    );

    this.task$ = this.employeeService.refresh$.pipe(
      switchMap(() => this.employeeService.getTaskById(this.taskId)),
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

  getStats(todos: ITodo[]): TodoStatistics {
    return getTodoStatistics(todos);
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
