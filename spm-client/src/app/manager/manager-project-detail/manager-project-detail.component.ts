import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-manager-project-detail",
  templateUrl: "./manager-project-detail.component.html",
  styleUrls: ["./manager-project-detail.component.scss"],
})
export class ManagerProjectDetailComponent implements OnInit {
  isLoading: boolean = false;
  id: number;
  selectedFood: string = "dosai guess";
  foods: string[] = ["dosa", "lol"];
  deadLine: Date = new Date();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get("id");
    });
  }

  navigateToTaskDetail(taskId: number): void {
    console.log("came here");
    this.router.navigate(["task-detail", taskId]);
  }
}
