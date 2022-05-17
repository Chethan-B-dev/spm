import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  typesOfShoes: string[] = ["hello", "world"];
  createdDate: Date = new Date();
  deadLine: Date = new Date();
  isLoading: boolean = false;

  constructor() {}

  ngOnInit() {}

  loadMoreDate(): void {
    this.isLoading = true;
    setTimeout(() => {
      let moreDate = ["lol", "dude", "how", "are", "you"];
      this.typesOfShoes = [...this.typesOfShoes, ...moreDate];
      this.isLoading = false;
    }, 3000);
  }
}
