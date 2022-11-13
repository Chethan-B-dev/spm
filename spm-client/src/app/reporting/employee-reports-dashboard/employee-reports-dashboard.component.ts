import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { TaskStatistics } from "src/app/shared/interfaces/task.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { SharedService } from "src/app/shared/shared.service";
import { goBack } from "src/app/shared/utility/common";
import { ReportsService } from "../services/reports.service";
declare let Highcharts: any;

@Component({
  selector: "app-employee-reports-dashboard",
  templateUrl: "./employee-reports-dashboard.component.html",
  styleUrls: ["./employee-reports-dashboard.component.scss"],
})
export class EmployeeReportsDashboardComponent implements OnInit {
  constructor(
    private readonly reportService: ReportsService,
    private readonly route: ActivatedRoute,
    private readonly managerService: ManagerService,
    private readonly sharedService: SharedService,
    private readonly snackbarService: SnackbarService
  ) {}
  project: IProject;
  user: IAppUser;
  projectId: number;
  userId: number;
  userTaskStatistics: TaskStatistics;
  totalTodosOfUser: string;
  employeeRank: string;
  employeeProjects$: Observable<IProject[]>;

  goBack(): void {
    goBack();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = +paramMap.get("projectId");
      this.userId = +paramMap.get("employeeId");
    });

    this.employeeProjects$ = this.sharedService
      .getAllEmployeeProjects(this.userId)
      .pipe(catchError(() => EMPTY));

    this.managerService
      .getProjectById(this.projectId)
      .pipe(catchError(() => EMPTY))
      .subscribe((project) => {
        this.project = project;
        this.user = this.project.users.find((user) => user.id === this.userId);
        // pie chart data
        const taskPriorityStatistics =
          this.reportService.getTasksPriorityDetails(this.project.tasks);

        this.userTaskStatistics = this.reportService.getUserTaskStatistics(
          this.project,
          this.user
        );

        this.totalTodosOfUser = this.reportService
          .getTotalTodosOfUser(this.project, this.user)
          .toString();

        this.employeeRank = this.reportService
          .getEmployeeRank(this.project, this.user)
          .toString();

        const barGraphData = this.reportService.getUserPerformanceChart(
          this.project,
          this.user
        );

        const average =
          Object.values(barGraphData).reduce((acc, curr) => {
            acc += curr;
            return acc;
          }, 0) / 5 || 0;

        Highcharts.chart("container", {
          title: {
            text: "Performance chart",
          },
          xAxis: {
            categories: [project.name],
          },
          credits: {
            enabled: false,
          },
          labels: {
            items: [
              {
                html: "Distribution",
                style: {
                  left: "50px",
                  top: "18px",
                  color:
                    (Highcharts.defaultOptions.title.style &&
                      Highcharts.defaultOptions.title.style.color) ||
                    "black",
                },
              },
            ],
          },
          series: [
            {
              type: "column",
              name: "Total Tasks",
              data: [barGraphData.total_tasks],
            },
            {
              type: "column",
              name: "Issues Raised",
              data: [barGraphData.issues_raised],
            },
            {
              type: "column",
              name: "Completed Tasks",
              data: [barGraphData.completed_tasks],
            },
            {
              type: "column",
              name: "Backlog Tasks",
              data: [barGraphData.backlog_tasks],
            },
            {
              type: "column",
              name: "In Progress Tasks",
              data: [barGraphData.in_progress_tasks],
            },
            {
              type: "spline",
              name: "Average",
              data: [average],
              marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: "white",
              },
            },
            {
              type: "pie",
              name: "Total ",
              data: [
                {
                  name: "Low Priority Tasks",
                  y: taskPriorityStatistics.LOW,
                  color: Highcharts.getOptions().colors[0],
                },
                {
                  name: "Medium Priority Tasks",
                  y: taskPriorityStatistics.MEDIUM,
                  color: Highcharts.getOptions().colors[1],
                },
                {
                  name: "High Priority Tasks",
                  y: taskPriorityStatistics.HIGH,
                  color: Highcharts.getOptions().colors[2],
                },
              ],
              center: [100, 80],
              size: 100,
              showInLegend: false,
              dataLabels: {
                enabled: false,
              },
            },
          ],
        });
      });
  }
}
