import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ConfirmDeleteComponent } from "src/app/shared/dialogs/confirm-delete/confirm-delete.component";
import { ITodo, TodoStatus } from "src/app/shared/interfaces/todo.interface";
import { DataType, DeleteData } from "src/app/shared/utility/common";

@Component({
  selector: "issue-card",
  templateUrl: "./issue-card.component.html",
  styleUrls: ["./issue-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueCardComponent {
  @Input() todo: ITodo;

  constructor(private readonly dialog: MatDialog) {}

  openDeleteTodoConfirmDialog(): void {
    const deleteData: DeleteData = {
      deleteType: DataType.TODO,
      id: this.todo.id,
    };
    this.dialog.open(ConfirmDeleteComponent, {
      data: deleteData,
    });
  }

  canDeleteTodo(): boolean {
    return this.todo.status !== TodoStatus.DONE;
  }
}
