import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { ITask } from "src/app/shared/interfaces/task.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";
import { Location } from "@angular/common";
import { DataType, DeleteData } from "src/app/shared/utility/common";
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from "src/app/shared/dialogs/confirm-delete/confirm-delete.component";

@Component({
  selector: "app-manager-task-detail",
  templateUrl: "./manager-task-detail.component.html",
  styleUrls: ["./manager-task-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerTaskDetailComponent implements OnInit, OnDestroy {
  taskId: number | undefined;
  task$: Observable<ITask>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: ParamMap) => {
        this.taskId = +params.get("id");
        this.managerService.refresh();
      });

    this.task$ = this.managerService.refresh$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.managerService.getTaskById(this.taskId)),
      catchError(() => EMPTY)
    );
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((deleted: boolean) => {
        if (deleted) {
          this.managerService
            .deleteTask(taskId)
            .pipe(
              takeUntil(this.destroy$),
              catchError((err) => {
                this.snackbarService.showSnackBar(err);
                return EMPTY;
              })
            )
            .subscribe(() => {
              this.snackbarService.showSnackBar("Task has been deleted");
              this.ngOnDestroy();
              this.managerService.refresh();
              this.location.back();
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
