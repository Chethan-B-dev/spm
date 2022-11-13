import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import {
  catchError,
  filter,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
import { ConfirmDeleteComponent } from "src/app/shared/dialogs/confirm-delete/confirm-delete.component";
import { ITask } from "src/app/shared/interfaces/task.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { DataType, DeleteData } from "src/app/shared/utility/common";
import { ManagerService } from "../services/manager.service";

@Component({
  selector: "app-manager-task-detail",
  templateUrl: "./manager-task-detail.component.html",
  styleUrls: ["./manager-task-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerTaskDetailComponent implements OnInit, OnDestroy {
  task$: Observable<ITask>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    const taskId$ = this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map((params) => +params.get("id"))
    );

    this.task$ = this.managerService.refresh$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(taskId$),
      switchMap(([_, taskId]) => this.managerService.getTaskById(taskId)),
      catchError(() => EMPTY)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDeleteTask(taskId: number): void {
    const deleteData: DeleteData = {
      deleteType: DataType.TASK,
      id: taskId,
    };

    this.dialog
      .open(ConfirmDeleteComponent, {
        data: deleteData,
      })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter((deleted: boolean) => deleted),
        switchMap(() => this.managerService.deleteTask(taskId)),
        catchError(() => EMPTY)
      )
      .subscribe(() => {
        this.snackbarService.showSnackBar("Task has been deleted");
        this.ngOnDestroy();
        this.managerService.refresh();
        this.location.back();
      });
  }
}
