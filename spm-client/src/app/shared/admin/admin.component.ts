import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from "../dialogs/confirm-delete/confirm-delete.component";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDeleteConfirmDialog(): void {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(result);
      // yes returns true
      // no returns false
    });
  }
}
