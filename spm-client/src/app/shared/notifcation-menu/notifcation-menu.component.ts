import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-notifcation-menu",
  templateUrl: "./notifcation-menu.component.html",
  styleUrls: ["./notifcation-menu.component.scss"],
})
export class NotifcationMenuComponent implements OnInit {
  showNotification: boolean;
  constructor() {}

  openNotification(state: boolean) {
    this.showNotification = state;
  }
  ngOnInit() {}
}
