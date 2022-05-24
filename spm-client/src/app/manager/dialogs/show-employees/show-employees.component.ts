import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IAppUser } from "src/app/shared/interfaces/user.interface";

@Component({
  selector: "app-show-employees",
  templateUrl: "./show-employees.component.html",
  styleUrls: ["./show-employees.component.scss"],
})
export class ShowEmployeesComponent implements OnInit {
  employees: IAppUser[];
  constructor(
    private dialogRef: MatDialogRef<ShowEmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) employees
  ) {
    this.employees = employees;
  }

  ngOnInit(): void {
    console.log(this.employees);
  }

  close(): void {
    this.dialogRef.close();
  }
}
