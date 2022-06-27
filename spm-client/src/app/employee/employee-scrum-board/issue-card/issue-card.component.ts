import { Component, Input } from "@angular/core";
import { ITodo } from "src/app/shared/interfaces/todo.interface";
@Component({
  selector: "issue-card",
  templateUrl: "./issue-card.component.html",
  styleUrls: ["./issue-card.component.scss"],
})
export class IssueCardComponent {
  @Input() todo: ITodo;
}
