import { Component, OnInit } from "@angular/core";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);
require("highcharts/modules/annotations")(Highcharts);

declare let Highcharts: any;
@Component({
  selector: "app-each-project-progress-board",
  templateUrl: "./each-project-progress-board.component.html",
  styleUrls: ["./each-project-progress-board.component.scss"],
})
export class EachProjectProgressBoardComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    Highcharts.chart("container-donut-chart", {
      chart: {
        type: "pie",
        plotShadow: false,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: "99%",
          borderWidth: 50,
          borderColor: null,
          slicedOffset: 20,
          dataLabels: {
            connectorWidth: 0,
          },
        },
      },
      title: {
        verticalAlign: "middle",
        floating: true,
        text: "Donut Chart",
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: "pie",
          data: [
            {
              name: "Developers",
              y: 1,
              color: "#eeeeee",
            },
            {
              name: "Testers",
              y: 2,
              color: "#393e46",
            },
            // { name: "Manager", y: 1, color: "#00adb5" },
            {
              name: "Devops",
              y: 3,
              color: "#eeeeee",
            },
            // { name: "Quality Analysts", y: 1, color: "#506ef9" },
            // change the value of y in order to change the data
          ],
        },
      ],
      exporting: {
        buttons: {
          contextButton: {
            menuItems: [
              "downloadPNG",
              "downloadJPEG",
              "downloadPDF",
              "downloadSVG",
            ],
          },
        },
      },
    });

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
        text: "subtitle",
      },
      xAxis: {
        allowDecimals: false,
        labels: {
          formatter: function () {
            return this.value; // clean, unformatted number for year
          },
        },
      },
      yAxis: {
        title: {
          text: "Percentage of Completion",
        },
        labels: {
          formatter: function () {
            return this.value / 1000 + "%";
          },
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
          data: [
            null,
            null,
            null,
            null,
            null,
            6,
            11,
            32,
            110,
            235,
            369,
            640,
            1005,
            1436,
            2063,
            3057,
            4618,
            6444,
            9822,
            15468,
            20434,
            24126,
            27387,
            29459,
            31056,
            31982,
            32040,
            31233,
            29224,
            27342,
            26662,
            26956,
            27912,
            28999,
            28965,
            27826,
            25579,
            25722,
            24826,
            24605,
            24304,
            23464,
            23708,
            24099,
            24357,
            24237,
            24401,
            24344,
            23586,
            22380,
            21004,
            17287,
            14747,
            13076,
            12555,
            12144,
            11009,
            10950,
            10871,
            10824,
            10577,
            10527,
            10475,
            10421,
            10358,
            10295,
            10104,
            9914,
            9620,
            9326,
            5113,
            5113,
            4954,
            4804,
            4761,
            4717,
            4368,
            4018,
          ],
        },
        {
          name: "Issues",
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            5,
            25,
            50,
            120,
            150,
            200,
            426,
            660,
            869,
            1060,
            1605,
            2471,
            3322,
            4238,
            5221,
            6129,
            7089,
            8339,
            9399,
            10538,
            11643,
            13092,
            14478,
            15915,
            17385,
            19055,
            21205,
            23044,
            25393,
            27935,
            30062,
            32049,
            33952,
            35804,
            37431,
            39197,
            45000,
            43000,
            41000,
            39000,
            37000,
            35000,
            33000,
            31000,
            29000,
            27000,
            25000,
            24000,
            23000,
            22000,
            21000,
            20000,
            19000,
            18000,
            18000,
            17000,
            16000,
            15537,
            14162,
            12787,
            12600,
            11400,
            5500,
            4512,
            4502,
            4502,
            4500,
            4500,
          ],
        },
      ],
    });

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
              name: "Chrome",
              y: 61.41,
              sliced: true,
              selected: true,
            },
            {
              name: "Internet Explorer",
              y: 11.84,
            },
            {
              name: "Firefox",
              y: 10.85,
            },
            {
              name: "Edge",
              y: 4.67,
            },
            {
              name: "Safari",
              y: 4.18,
            },
            {
              name: "Sogou Explorer",
              y: 1.64,
            },
            {
              name: "Opera",
              y: 1.6,
            },
            {
              name: "QQ",
              y: 1.2,
            },
            {
              name: "Other",
              y: 2.61,
            },
          ],
        },
      ],
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
        categories: ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"],
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: "All Tasks's Live Progress",
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
          name: "Tasks",
          data: [50, 30, 34, 74, 32],
        },
        {
          name: "Issues",
          data: [23, 25, 43, 52, 10],
        },
        {
          name: "Completed",
          data: [3, 1, 4, 12, 8],
        },
      ],
    });
    // bar chart end
  }
}
