import { Component, OnInit } from "@angular/core";
import { mockProject } from "../../project.mock";
import { ReportsService } from "../../services/reports.service";
declare let Highcharts: any;
try {
  require("highcharts/modules/exporting")(Highcharts);
  require("highcharts/modules/export-data")(Highcharts);
  require("highcharts/modules/annotations")(Highcharts);
} catch (err) {
  console.error(err);
}

@Component({
  selector: "app-each-project-progress-board",
  templateUrl: "./each-project-progress-board.component.html",
  styleUrls: ["./each-project-progress-board.component.scss"],
})
export class EachProjectProgressBoardComponent implements OnInit {
  constructor(private reportService: ReportsService) {}

  project = mockProject;
  ngOnInit() {
    // Processing Data start

    //  Processing for Donut Chart and Pie Chart
    // const userStats = this.reportService.getUserDesignationStatistics(this.project);

    const taskPriorityStatistics = this.reportService.getTasksPriorityDetails(
      this.project.tasks
    );

    const dates = this.reportService.getAllTasksAreaProgress(this.project);
    const counts = this.reportService.getAllTaskStatusCount(this.project);
    console.log(counts);
    // console.log(dates);
    // console.log("Second");
    // console.log("Developer count",userStats.DEVELOPER);
    // console.log(Object.values(dates).map(({x,y}) => x));
    //  Processing for Stacked Bar Graph
    // ----------------------Hard coded for only one Task-----------------------------
    const taskStatusBarGraph = this.reportService.getProjectTaskStatistics(
      this.project.tasks
    );
    // console.log("Task bar graph",taskStatusBarGraph);

    // Processing Data end

    // donut chart start

    // Highcharts.chart("container-donut-chart", {
    //   chart: {
    //     type: "pie",
    //     plotShadow: false,
    //   },
    //   credits: {
    //     enabled: false,
    //   },
    //   plotOptions: {
    //     pie: {
    //       innerSize: "99%",
    //       borderWidth: 50,
    //       borderColor: null,
    //       slicedOffset: 20,
    //       dataLabels: {
    //         connectorWidth: 0,
    //       },
    //     },
    //   },
    //   title: {
    //     verticalAlign: "middle",
    //     floating: true,
    //     text: "Donut Chart",
    //   },
    //   legend: {
    //     enabled: false,
    //   },
    //   series: [
    //     {
    //       type: "pie",
    //       data: [
    //         { name: "Developers", y: userStats.DEVELOPER, color: "#eeeeee" },
    //         { name: "Testers", y: userStats.TESTER, color: "#393e46" },
    //         { name: "Devops", y: userStats.DEVOPS, color: "#00adb5" },
    //         { name: "Quality Analysts", y: 1, color: "#506ef9" },
    //         // change the value of y in order to change the data
    //       ],
    //     },
    //   ],
    //   exporting: {
    //     buttons: {
    //       contextButton: {
    //         menuItems: [
    //           "downloadPNG",
    //           "downloadJPEG",
    //           "downloadPDF",
    //           "downloadSVG",
    //         ],
    //       },
    //       credits: {
    //         enabled: false,
    //       },
    //       plotOptions: {
    //         pie: {
    //           innerSize: "99%",
    //           borderWidth: 50,
    //           borderColor: null,
    //           slicedOffset: 20,
    //           dataLabels: {
    //             connectorWidth: 0,
    //           },
    //         },
    //       },
    //       title: {
    //         verticalAlign: "middle",
    //         floating: true,
    //         text: "Donut Chart",
    //       },
    //       legend: {
    //         enabled: false,
    //       },
    //       series: [
    //         {
    //           type: "pie",
    //           data: [
    //             {
    //               name: "Developers",
    //               y: 1,
    //               color: "#eeeeee",
    //             },
    //             {
    //               name: "Testers",
    //               y: 2,
    //               color: "#393e46",
    //             },
    //             // { name: "Manager", y: 1, color: "#00adb5" },
    //             {
    //               name: "Devops",
    //               y: 3,
    //               color: "#eeeeee",
    //             },
    //             // { name: "Quality Analysts", y: 1, color: "#506ef9" },
    //             // change the value of y in order to change the data
    //           ],
    //         },
    //       ],
    //       exporting: {
    //         buttons: {
    //           contextButton: {
    //             menuItems: [
    //               "downloadPNG",
    //               "downloadJPEG",
    //               "downloadPDF",
    //               "downloadSVG",
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // donut chart end

    // area chart start

    Highcharts.chart("container-area-chart", {
      chart: {
        type: "area",
      },
      credits: {
        enabled: false,
      },
      title: {
        text: "Area chart",
      },
      subtitle: {
        text: "Tasks/Issue's Timeline",
      },
      xAxis: {
        categories: [...Object.values(dates).map(({ x }) => x)],
        allowDecimals: false,
        // title: {
        //   text: "Project Timeline",
        // },
        //   labels: {
        //     formatter: function () {
        //         return Object.values(Object.keys(dates));
        //     }
        // }
      },
      yAxis: {
        title: {
          text: "No. of Tasks/Issues Completed",
        },
      },
      tooltip: {
        pointFormat:
          "{series.name} had completed <b>{point.y:,.0f}</b><br/>on {point.x}",
      },
      plotOptions: {
        area: {
          pointStart: 0,
          marker: {
            enabled: false,
            symbol: "circle",
            radius: 2,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      series: [
        {
          name: "Tasks",
          data: [...Object.values(dates).map(({ y }) => y)],
        },
      ],
    });

    // area chart end

    // area chart end

    // Pie chart start
    Highcharts.chart("container-pie-chart", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      credits: {
        enabled: false,
      },
      title: {
        text: "Pie Chart",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: "Brands",
          colorByPoint: true,
          data: [
            {
              name: "Low Priority Tasks",
              y: taskPriorityStatistics.LOW,
              sliced: true,
              selected: true,
            },
            {
              name: "Medium Priority Tasks",
              y: taskPriorityStatistics.MEDIUM,
            },
            {
              name: "High Priority Tasks",
              y: taskPriorityStatistics.HIGH,
            },
          ],
        },
      ],
      // change the value of y to change the data
    });
    // Pie chart end

    // bar chart start
    Highcharts.chart("container-bar-chart", {
      chart: {
        type: "bar",
      },
      credits: {
        enabled: false,
      },
      title: {
        text: "Stacked bar chart",
      },
      xAxis: {
        categories: [...counts.names],
      },
      yAxis: {
        min: 0,
        max: counts.max,
        title: {
          text: "To-Do's",
        },
      },
      legend: {
        reversed: true,
      },
      plotOptions: {
        series: {
          stacking: "normal",
        },
      },
      series: [
        {
          name: "In Progress Tasks",
          data: [...counts.in_progress],
        },
        {
          name: "Completed Tasks",
          data: [...counts.done],
          color: "lightgreen",
        },
        {
          name: "To-Do Tasks",
          data: [...counts.todo],
          color: "orange",
        },
      ],
    });
    // bar chart end
  }
}
