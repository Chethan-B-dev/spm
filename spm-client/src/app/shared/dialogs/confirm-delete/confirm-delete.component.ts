import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
} from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteComponent implements OnDestroy {
  deleteData: DeleteData;
  private readonly destroy$ = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) deleteData,
    private readonly dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    private readonly managerService: ManagerService,
    private readonly sharedService: SharedService,
    private readonly snackbarService: SnackbarService
  ) {
    this.deleteData = deleteData;
  }

  onDeleteClick(): void {
    switch (this.deleteData.deleteType) {
      case DataType.TODO:
        this.deleteTodo();
        break;
      case DataType.COMMENT:
        this.deleteComment();
        break;
      case DataType.TASK:
        this.close(true);
        break;
      default:
        this.close(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(isDeleted: boolean): void {
    this.dialogRef.close(isDeleted);
  }

  private deleteTodo(): void {
    this.managerService
      .deleteTodo(this.deleteData.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          this.close(false);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.snackbarService.showSnackBar("Todo has been deleted");
        this.close(true);
      });
  }

  private deleteComment(): void {
    this.sharedService
      .deleteComment(this.deleteData.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => EMPTY)
      )
      .subscribe((isCommentDeleted: boolean) => {
        if (isCommentDeleted) {
          this.snackbarService.showSnackBar("comment has been deleted");
          this.close(true);
        } else {
          this.snackbarService.showSnackBar(
            "something went wrong, comment could not be deleted"
          );
          this.close(false);
        }
      });
  }
}
