import { Component, Input, OnInit } from "@angular/core";
import { ITask } from "../interfaces/task.interface";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent implements OnInit {
  @Input() task: ITask;

  constructor() {}

  ngOnInit() {}
}
