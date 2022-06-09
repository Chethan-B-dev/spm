import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";
import { ITask } from "src/app/shared/interfaces/task.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

@Component({
  selector: "app-manager-task-detail",
  templateUrl: "./manager-task-detail.component.html",
  styleUrls: ["./manager-task-detail.component.scss"],
})
export class ManagerTaskDetailComponent implements OnInit, OnDestroy {
  taskId: number | undefined;
  task$: Observable<ITask>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.taskId = +params.get("id");
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

  navigateToTaskDetail(taskId: number): void {}
}
