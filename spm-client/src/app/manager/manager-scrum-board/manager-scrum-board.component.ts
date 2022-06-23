import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { ITask } from "src/app/shared/interfaces/task.interface";
import {
  getTodoStatistics,
  ITodo,
  TodoStatus,
} from "src/app/shared/interfaces/todo.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
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
    private readonly snackbarService: SnackbarService
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
    window.history.go(-1);
  }

  createTodo(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.taskId;

    this.dialog.open(CreateTodoComponent, dialogConfig);
  }

  getCompletedPercentage(todos: ITodo[]): number {
    const todoStatistics = getTodoStatistics(todos);
    return ((todoStatistics[TodoStatus.DONE] / todos.length) * 100) | 0;
  }
}
