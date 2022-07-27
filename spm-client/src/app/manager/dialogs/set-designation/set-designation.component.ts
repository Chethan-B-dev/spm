import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EMPTY, forkJoin, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { INotification } from "src/app/shared/interfaces/notification.interface";
import {
  avatarImage,
  IAppUser,
} from "src/app/shared/interfaces/user.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-set-designation",
  templateUrl: "./set-designation.component.html",
  styleUrls: ["./set-designation.component.scss"],
})
export class SetDesignationComponent implements OnInit, OnDestroy {
  avatarImage = avatarImage;
  employees: IAppUser[];
  manager: IAppUser;
  designations: string[];
  private readonly destroy$ = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<SetDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly notificationService: NotificationService
  ) {
    this.employees = data.employees;
    this.manager = data.manager;
  }

  ngOnInit(): void {
    this.designations = new Array(this.employees.length).fill("");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(setDesignations: boolean): void {
    this.dialogRef.close(setDesignations);
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

  allDesignationsAreSet(): boolean {
    return this.designations.every((designation) => !!designation);
  }
}
