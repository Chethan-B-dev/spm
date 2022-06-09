import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from "src/app/shared/dialogs/confirm-delete/confirm-delete.component";
import { ITodo } from "src/app/shared/interfaces/todo.interface";
import { DeleteData, DeleteType } from "src/app/shared/utility/common";

@Component({
  selector: "issue-card",
  templateUrl: "./issue-card.component.html",
  styleUrls: ["./issue-card.component.scss"],
})
export class IssueCardComponent implements OnInit {
  @Input() todo: ITodo;

  constructor(public dialog: MatDialog) {}

  openDeleteConfirmDialog(): void {
    const deleteData: DeleteData = {
      deleteType: DeleteType.TODO,
      id: this.todo.id,
    };
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: deleteData,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(result);
      // yes returns true
      // no returns false
    });
  }

  ngOnInit() {}
}
