import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent implements OnInit {
  createdDate: Date = new Date();
  name: string = "testProject";
  deadLine: Date = new Date();
  toppingList: string[] = ["hello", "world", "hwo", "are", "you"];

  constructor() {}

  ngOnInit() {}
}
