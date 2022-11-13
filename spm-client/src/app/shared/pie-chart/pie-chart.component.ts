import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import * as CanvasJS from "../../../assets/canvasjs.min.js";
import {
  getIssueStatistics,
  IssueStatistics,
  IssueStatusOptions,
} from "../interfaces/issue.interface.js";
import {
  getTodoStatistics,
  TodoStatistics,
  TodoStatusOptions,
} from "../interfaces/todo.interface.js";
import { DataType, myTitleCase, PieData } from "../utility/common.js";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnInit {
  @Input() pieData: PieData<any>;
  todoStats: TodoStatistics;
  issueStats: IssueStatistics;

  ngOnInit() {
    switch (this.pieData.type) {
      case DataType.TODO:
        this.todoStats = getTodoStatistics(this.pieData.data);
        break;
      case DataType.ISSUE:
        this.issueStats = getIssueStatistics(this.pieData.data);
        break;
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
          toolTipContent: "<b>{name}</b>: (#percent%)",
          indexLabel: "{name} - #percent%",
          dataPoints: this.pieChartData(),
        },
      ],
    });

    chart.render();
  }

  private pieChartData(): { y: number; name: string }[] {
    const pieData: { y: number; name: string }[] = [];
    switch (this.pieData.type) {
      case DataType.TODO:
        const noTodos = TodoStatusOptions.every(
          (todoStatus) => this.todoStats[todoStatus] === 0
        );
        if (noTodos)
          return [
            {
              y: 100,
              name: `No ${myTitleCase(
                this.pieData.type
              )}'s have been added yet`,
            },
          ];
        TodoStatusOptions.forEach((todoStatus) => {
          pieData.push({
            y: this.todoStats[todoStatus],
            name: todoStatus.replace("_", " "),
          });
        });
        break;
      case DataType.ISSUE:
        const noIssues = IssueStatusOptions.every(
          (issueStatus) => this.issueStats[issueStatus] === 0
        );
        if (noIssues)
          return [
            {
              y: 100,
              name: `No ${myTitleCase(
                this.pieData.type
              )}'s have been Reported yet`,
            },
          ];
        IssueStatusOptions.forEach((issueStatus) => {
          pieData.push({
            y: this.issueStats[issueStatus],
            name: issueStatus.replace("_", " "),
          });
        });
        break;
    }
    return pieData;
  }
}
