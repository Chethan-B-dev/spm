import { Component, Input, OnInit } from "@angular/core";
import { ITask } from "../interfaces/task.interface";
import { ITodo } from "../interfaces/todo.interface";
import { DataType, PieData } from "../utility/common";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent implements OnInit {
  @Input() task: ITask;
  @Input() showBackBtn: boolean;

  constructor() {}

  ngOnInit(): void {}

  get pieChartData(): PieData<ITodo> {
    return { type: DataType.TODO, data: this.task.todos } as PieData<ITodo>;
  }

  goBack(): void {
    window.history.go(-1);
  }
}
