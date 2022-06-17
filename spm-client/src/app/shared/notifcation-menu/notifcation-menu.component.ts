import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-notifcation-menu",
  templateUrl: "./notifcation-menu.component.html",
  styleUrls: ["./notifcation-menu.component.scss"],
})
export class NotifcationMenuComponent {
  showNotification: boolean;

  openNotification(state: boolean) {
    this.showNotification = state;
  }
}
