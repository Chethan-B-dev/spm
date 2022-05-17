import { OnInit } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { Component } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
