import { Component, Inject, OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { ManagerService } from "src/app/manager/services/manager.service";
import { SnackbarService } from "../../services/snackbar.service";
import { SharedService } from "../../shared.service";
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
    private sharedService: SharedService,
    private snackbarService: SnackbarService
  ) {
    this.deleteData = deleteData;
  }

  onDeleteClick(): void {
    switch (this.deleteData.deleteType) {
      case DataType.TODO:
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
        break;
      case DataType.COMMENT:
        this.sharedService
          .deleteComment(this.deleteData.id)
          .pipe(
            takeUntil(this.destroy$),
            catchError((err) => {
              this.snackbarService.showSnackBar(err);
              return EMPTY;
            })
          )
          .subscribe((res) => {
            if (res)
              this.snackbarService.showSnackBar(`comment has been deleted`);
          });
        break;
      default:
        this.close();
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
