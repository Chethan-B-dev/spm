import { not } from "@angular/compiler/src/output/output_ast.js";
import { Component, Input, OnInit } from "@angular/core";
import * as CanvasJS from "../../../assets/canvasjs.min.js";
import {
  getTodoStatistics,
  TodoStatistics,
  TodoStatus,
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
  todoStats: TodoStatistics;

  constructor() {}

  ngOnInit() {
    if (this.pieData.type === DataType.TODO) {
      this.todoStats = getTodoStatistics(this.pieData.data);
    }

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

  private pieChartData(): { y: number; name: string }[] {
    const pieData: { y: number; name: string }[] = [];
    if (this.pieData.type === DataType.TODO) {
      const noTodos: boolean = TodoStatusOptions.every(
        (todoStatus) => this.todoStats[todoStatus] === 0
      );
      if (noTodos)
        return [{ y: 100, name: "No Todos have been added for this task yet" }];
      TodoStatusOptions.forEach((todoStatus: TodoStatus) => {
        pieData.push({
          y: this.todoStats[todoStatus],
          name: todoStatus.replace("_", " "),
        });
      });
    }
    return pieData;
  }
}
