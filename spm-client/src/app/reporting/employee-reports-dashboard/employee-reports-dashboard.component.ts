import { Component, OnInit } from '@angular/core';
import { mockProject } from '../project.mock';
import { ReportsService } from '../services/reports.service';
declare let Highcharts: any;

@Component({
  selector: 'app-employee-reports-dashboard',
  templateUrl: './employee-reports-dashboard.component.html',
  styleUrls: ['./employee-reports-dashboard.component.scss']
})
export class EmployeeReportsDashboardComponent implements OnInit {

  constructor(private reportService: ReportsService) { }
  project = mockProject;
  ngOnInit() {

    // Data processing start
    const taskPriorityStatistics = this.reportService.getTasksPriorityDetails(
      this.project.tasks
    );

    const getAllProjectsTasksCount = this.reportService.getAllTaskStatusCount(
      this.project
    );
    console.log(getAllProjectsTasksCount.todo.length);
    let todoCount = getAllProjectsTasksCount.todo.length;
    let inProgressCount = getAllProjectsTasksCount.in_progress.length;
    let doneCount = getAllProjectsTasksCount.done.length;
    console.log(todoCount);
    console.log(inProgressCount);
    console.log(doneCount);

    const getProjectsPresentIn = this.reportService.getTotalProjectWorkingInCount(this.project);
    console.log("Present in projects",getProjectsPresentIn);


    const getUserCountOfAllTasks = this.reportService.getProjectStatisticsPerUser(this.project.tasks);
      console.log("Count per user",getUserCountOfAllTasks);
    // Data processing end




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
              name: 'Low Priority Tasks',
              y: taskPriorityStatistics.LOW,
              color: Highcharts.getOptions().colors[0]
          }, {
              name: 'Medium Priority Tasks',
              y: taskPriorityStatistics.MEDIUM,
              color: Highcharts.getOptions().colors[1]
          }, {
              name: 'High Priority Tasks',
              y: taskPriorityStatistics.HIGH,
              color: Highcharts.getOptions().colors[2]
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
