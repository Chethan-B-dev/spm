import { Component, OnInit } from "@angular/core";
import * as CanvasJS from "../../../assets/canvasjs.min.js";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
})
export class PieChartComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    let chart = new CanvasJS.Chart("chartContainer", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Issue Stats",
      },
      data: [
        {
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
          indexLabel: "{name} - #percent%",
          dataPoints: [
            { y: 100, name: "Total Issues" },
            { y: 60, name: "Resolved Issues" },
            { y: 40, name: "Pending Issues" },
          ],
        },
      ],
    });

    chart.render();
  }
}
