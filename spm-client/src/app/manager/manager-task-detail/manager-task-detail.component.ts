import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-manager-task-detail",
  templateUrl: "./manager-task-detail.component.html",
  styleUrls: ["./manager-task-detail.component.scss"],
})
export class ManagerTaskDetailComponent implements OnInit {
  id: number | undefined;
  isLoading: boolean = false;
  deadLine: Date = new Date();
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get("id");
    });
  }

  navigateToTaskDetail(taskId: number): void {}
}
