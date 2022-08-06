import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EMPTY, Subject, Subscription } from "rxjs";
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
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) deleteData,
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    private managerService: ManagerService,
    private sharedService: SharedService,
    private snackbarService: SnackbarService
  ) {
    this.deleteData = deleteData;
  }

  onDeleteClick(): void {
    switch (this.deleteData.deleteType) {
      case DataType.TODO:
        this.subscriptions.push(
          this.managerService
            .deleteTodo(this.deleteData.id)
            .pipe(
              takeUntil(this.destroy$),
              catchError((err) => {
                this.snackbarService.showSnackBar(err);
                this.close(false);
                return EMPTY;
              })
            )
            .subscribe(() => {
              this.snackbarService.showSnackBar("Todo has been deleted");
              this.close(true);
            })
        );
        break;
      case DataType.COMMENT:
        this.subscriptions.push(
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
              this.close(true);
            })
        );
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
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  close(deleted: boolean): void {
    this.dialogRef.close(deleted);
  }
}
