import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";
import { ITask } from "src/app/shared/interfaces/task.interface";
import {
  getTodoStatistics,
  ITodo,
  TodoStatistics,
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
    private managerService: ManagerService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.taskId = +params.get("taskId");
    });

    this.task$ = this.managerService.refresh$.pipe(
      switchMap(() => this.managerService.getTaskById(this.taskId)),
      tap((task) => console.log(JSON.stringify(task))),
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

  createTodo(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = "400px";

    // todo: send task here
    dialogConfig.data = this.taskId;

    const dialogRef = this.dialog.open(CreateTodoComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe((data) => console.log("Dialog output:", data));
  }

  getCompletedPercentage(todos: ITodo[]): number {
    const todoStatistics: TodoStatistics = getTodoStatistics(todos);
    return (todoStatistics[TodoStatus.DONE] / todos.length) * 100;
  }
}
