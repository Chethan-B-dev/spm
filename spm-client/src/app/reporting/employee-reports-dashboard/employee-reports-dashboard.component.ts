import { Component, OnInit } from '@angular/core';
declare let Highcharts: any;
@Component({
  selector: 'app-employee-reports-dashboard',
  templateUrl: './employee-reports-dashboard.component.html',
  styleUrls: ['./employee-reports-dashboard.component.scss']
})
export class EmployeeReportsDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // stacked graph start
    Highcharts.chart('container', {
      title: {
          text: 'Performance chart'
      },
      xAxis: {
          categories: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5']
      },
      credits: {
        enabled: false
      },
      labels: {
          items: [{
              html: 'Distribution',
              style: {
                  left: '50px',
                  top: '18px',
                  color: ( // theme
                      Highcharts.defaultOptions.title.style &&
                      Highcharts.defaultOptions.title.style.color
                  ) || 'black'
              }
          }]
      },
      series: [{
          type: 'column',
          name: 'Tasks',
          data: [3, 2, 1, 3, 4]
      }, {
          type: 'column',
          name: 'Issues',
          data: [2, 3, 5, 7, 6]
      }, {
          type: 'column',
          name: 'To-Do',
          data: [4, 3, 3, 9, 0]
      }, {
          type: 'spline',
          name: 'Average',
          data: [3, 2.67, 3, 6.33, 3.33],
          marker: {
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[3],
              fillColor: 'white'
          }
      }, {
          type: 'pie',
          name: 'Total ',
          data: [{
              name: 'Tasks',
              y: 13,
              color: Highcharts.getOptions().colors[0] // Jane's color
          }, {
              name: 'Issues',
              y: 23,
              color: Highcharts.getOptions().colors[1] // John's color
          }, {
              name: 'To-Do',
              y: 19,
              color: Highcharts.getOptions().colors[2] // Joe's color
          }],
          center: [100, 80],
          size: 100,
          showInLegend: false,
          dataLabels: {
              enabled: false
          }
      }]
  });




  }

}
