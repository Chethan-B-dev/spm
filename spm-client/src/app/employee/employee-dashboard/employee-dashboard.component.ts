import { Component, OnInit } from '@angular/core';
declare let Highcharts: any;




@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const chart = Highcharts.chart('container', {
      chart: {
          type: 'bar',
          height: 450,
          width:700

      },
      title: {
          text: 'Project Team Statistics'
      },
      xAxis: {
          categories: ['Developers', 'Testers', 'Q/A']
      },
      yAxis: {
          title: {
              text: 'Strength'
          }
      },
      series: [{
          name: 'Jane',
          data: [1, 5, 4]
      }]
  });
  }
}
