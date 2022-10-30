import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EMPTY, forkJoin, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import {
  AvatarImage,
  IAppUser,
} from "src/app/shared/interfaces/user.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-set-designation",
  templateUrl: "./set-designation.component.html",
  styleUrls: ["./set-designation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetDesignationComponent implements OnDestroy {
  employees: IAppUser[];
  manager: IAppUser;
  designations: string[];

  readonly avatarImage = AvatarImage;
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private readonly dialogRef: MatDialogRef<SetDesignationComponent>,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
  ) {
    this.employees = data.employees;
    this.manager = data.manager;
    this.designations = Array(this.employees.length).fill("");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(designationsSet: boolean): void {
    this.dialogRef.close(designationsSet);
  }

  setDesignations(): void {
    this.employees = this.employees.map(
      (employee, index) =>
        ({
          ...employee,
          designation: this.designations[index],
        } as IAppUser)
    );

    const requests = this.employees.map((employee) =>
      this.managerService.setEmployeeDesignation(employee)
    );

    forkJoin(requests)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.close(false);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.employees.forEach((employee, index) => {
          const notification: INotification = {
            userId: employee.id,
            notification: `Manager: ${
              this.manager.username
            } has set your designation to ${this.designations[
              index
            ].toLowerCase()}`,
            time: Date.now(),
          };
          this.notificationService.addNotification(notification);
        });
        this.close(true);
        this.snackbarService.showSnackBar("User Designations have been set");
      });
  }

  isAnyDesignationNotSet(): boolean {
    return this.designations.some((designation) => !designation);
  }
}
