import { Component, OnInit } from '@angular/core';
declare let Highcharts: any;

@Component({
  selector: 'app-burn-down-chart-dashboard',
  templateUrl: './burn-down-chart-dashboard.component.html',
  styleUrls: ['./burn-down-chart-dashboard.component.scss']
})
export class BurnDownChartDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Over all progress burn down charts
    Highcharts.chart('overall-burndown', {
      chart: {
        backgroundColor: 'white',
    },
      title: {
        text: 'Project Burndown Chart'
      },
      credits: {
        enabled: false
    },
      colors: ['blue', 'red'],
      subtitle: {
          text: 'Overall Burndown for the Project: Title'
      },

      yAxis: {
        title: {
          text: 'Hours'
        },

      xAxis: {
        title: {
          text: 'Days'
        },
        categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6',
                     'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12']
      },

      plotLines: [{
        value: 0,
        width: 1
      }]
    },
    tooltip: {
      valueSuffix: ' hrs',
      crosshairs: true,
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: 'Ideal Burn',
      color: 'green',
      lineWidth: 2,
      data: [110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
    }, {
      name: 'Actual Burn',
      color: 'orange',
      marker: {
        radius: 6
      },
      data: [100, 110, 125, 95, 64, 76, 62, 44, 35, 29, 18, 2]
    }],

  });

    // Issues burn down charts
    Highcharts.chart('issues-burndown', {
      chart: {
        backgroundColor: '#f7f7f5',
    },
      title: {
        text: 'Issue Burndown Chart',
      },
      credits: {
        enabled: false
    },
      colors: ['green', 'red'],
      subtitle: {
          text: 'Issues Burndown for the Project: Title'
      },

      yAxis: {
        title: {
          text: 'Hours'
        },

      xAxis: {
        title: {
          text: 'Days'
        },
        categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6',
                     'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12']
      },

      plotLines: [{
        value: 0,
        width: 1
      }]
    },
    tooltip: {
      valueSuffix: ' hrs',
      crosshairs: true,
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: 'Ideal Burn',
      color: 'green',
      lineWidth: 2,
      data: [110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
    }, {
      name: 'Actual Burn',
      color: 'red',
      marker: {
        radius: 6
      },
      data: [100, 110, 125, 95, 64, 76, 62, 44, 35, 29, 18, 2]
    }],

  });

    // Tasks burn down charts
    Highcharts.chart('tasks-burndown', {

      title: {
        text: 'Tasks Burndown Chart',
      },
      credits: {
        enabled: false
    },
      colors: ['green', 'red'],
      subtitle: {
          text: 'Issues Burndown for the Project: Title'
      },

      yAxis: {
        title: {
          text: 'Hours'
        },

      xAxis: {
        title: {
          text: 'Days'
        },
        categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6',
                     'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12']
      },

      plotLines: [{
        value: 0,
        width: 1
      }]
    },
    tooltip: {
      valueSuffix: ' hrs',
      crosshairs: true,
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: 'Ideal Burn',
      color: 'rgba(255,0,0,0.25)',
      lineWidth: 2,
      data: [110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
    }, {
      name: 'Actual Burn',
      color: 'rgba(0,120,200,0.75)',
      marker: {
        radius: 6
      },
      data: [100, 110, 125, 95, 64, 76, 62, 44, 35, 29, 18, 2]
    }],

  });

  }

}
