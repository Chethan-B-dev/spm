import { HttpResponse } from "@angular/common/http";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { ManagerService } from "src/app/manager/services/manager.service";
import { SnackbarService } from "../../services/snackbar.service";
import { DataType, DeleteData } from "../../utility/common";

@Component({
  selector: "app-confirm-delete",
  templateUrl: "./confirm-delete.component.html",
  styleUrls: ["./confirm-delete.component.scss"],
})
export class ConfirmDeleteComponent implements OnDestroy {
  deleteData: DeleteData;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) deleteData,
    private managerService: ManagerService,
    private snackbarService: SnackbarService
  ) {
    this.deleteData = deleteData;
  }

  onDeleteClick(): void {
    if (this.deleteData.deleteType === DataType.TODO) {
      this.managerService
        .deleteTodo(this.deleteData.id)
        .pipe(
          takeUntil(this.destroy$),
          catchError((err) => {
            this.snackbarService.showSnackBar(err);
            this.close();
            return EMPTY;
          })
        )
        .subscribe((_) => {
          this.snackbarService.showSnackBar("Todo has been deleted");
          this.close();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.dialogRef.close();
  }
}
