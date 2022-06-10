import { Component, Input, OnInit } from "@angular/core";
import * as CanvasJS from "../../../assets/canvasjs.min.js";
import {
  getTodoStatistics,
  TodoStatusOptions,
} from "../interfaces/todo.interface.js";
import { DataType, myTitleCase, PieData } from "../utility/common.js";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
})
export class PieChartComponent implements OnInit {
  @Input()
  pieData: PieData<any>;
  stats: any;

  constructor() {}

  ngOnInit() {
    this.stats = getTodoStatistics(this.pieData.data);

    const chart = new CanvasJS.Chart("chartContainer", {
      theme: "light1",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: `${myTitleCase(this.pieData.type.toLowerCase())} Stats`,
      },
      data: [
        {
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
          indexLabel: "{name} - #percent%",
          dataPoints: this.pieChartData(),
        },
      ],
    });

    chart.render();
  }

  private pieChartData(): Array<{ y: number; name: string }> {
    const pieData: Array<{ y: number; name: string }> = [];
    if (this.pieData.type === DataType.TODO) {
      TodoStatusOptions.forEach((todoStatus) => {
        pieData.push({
          y: this.stats[todoStatus],
          name: todoStatus.replace("_", " "),
        });
      });
    }
    return pieData;
  }
}
