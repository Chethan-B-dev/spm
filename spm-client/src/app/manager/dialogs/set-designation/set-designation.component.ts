import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { EMPTY, forkJoin, Observable, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import {
  IAppUser,
  IEditProfileRequest,
} from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-set-designation",
  templateUrl: "./set-designation.component.html",
  styleUrls: ["./set-designation.component.scss"],
})
export class SetDesignationComponent implements OnInit, OnDestroy {
  employees: IAppUser[];
  designations: string[];
  private readonly destroy$ = new Subject<void>();
  constructor(
    private dialogRef: MatDialogRef<SetDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) employees,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService
  ) {
    this.employees = employees;
  }

  ngOnInit(): void {
    this.designations = new Array(this.employees.length).fill("");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.dialogRef.close();
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
      this.authService.setEmployeeDesignation(employee)
    );

    forkJoin(requests)
      .pipe(
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe(() =>
        this.snackbarService.showSnackBar("User Designations have been set")
      );
  }

  allDesignationsAreSet(): boolean {
    return this.designations.every((designation) => !!designation);
  }
}
