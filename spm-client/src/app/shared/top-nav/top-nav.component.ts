import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-top-nav",
  templateUrl: "./top-nav.component.html",
  styleUrls: ["./top-nav.component.scss"],
})
export class TopNavComponent implements OnInit {
  @Output() sideNav = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  toggleSideNav(): void {
    this.sideNav.emit();
  }
}
