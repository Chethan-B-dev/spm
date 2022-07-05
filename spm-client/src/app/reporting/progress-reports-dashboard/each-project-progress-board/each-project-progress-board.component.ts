import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { TaskPriority } from "src/app/shared/interfaces/task.interface";
import {
  IAppUser,
  UserDesignation,
  UserDesignations,
  UserDesignationStatisticsCount,
  UserRole,
} from "src/app/shared/interfaces/user.interface";
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
export class EachProjectProgressBoardComponent implements OnInit, OnDestroy {
  constructor(
    private readonly reportService: ReportsService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}
  project: IProject;
  currentUser: IAppUser;
  taskPriorityStatistics;
  tasksAreaProgress;
  tasksStatusCount;
  private readonly destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.currentUser = user));

    this.route.paramMap.subscribe((paramMap) => {
      const projectId = +paramMap.get("projectId");
      const userProjects$ =
        this.currentUser.role === UserRole.MANAGER
          ? this.managerService.getProjectById(projectId)
          : this.employeeService.getProjectById(projectId);
      userProjects$.pipe(takeUntil(this.destroy$)).subscribe((project) => {
        console.log(project);
        this.project = project || mockProject;
        this.taskPriorityStatistics =
          this.reportService.getTasksPriorityDetails(this.project.tasks);

        this.tasksAreaProgress =
          this.reportService.getAllTasksAreaProgress(mockProject);

        this.tasksStatusCount = this.reportService.getAllTaskStatusCount(
          this.project
        );

        const userDesignationCount =
          this.reportService.getProjectUserDesignationCount(this.project);

        Highcharts.chart("container-donut-chart", {
          chart: {
            type: "pie",
            plotShadow: false,
          },
          tooltip: {
            pointFormat: "<b>{point.percentage:.1f}%</b>",
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
            enabled: true,
          },
          series: [
            {
              type: "pie",
              data: [
                {
                  name: "Developers",
                  y: userDesignationCount[UserDesignation.DEVELOPER],
                  color: "#eeeeee",
                },
                {
                  name: "Testers",
                  y: userDesignationCount[UserDesignation.TESTER],
                  color: "#393e46",
                },
                {
                  name: "Devops",
                  y: userDesignationCount[UserDesignation.DEVOPS],
                  color: "#00adb5",
                },
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
                enabled: true,
              },
              // series: [
              //   {
              //     type: "pie",
              //     data: [
              //       {
              //         name: "Developers",
              //         y: 1,
              //         color: "#eeeeee",
              //       },
              //       {
              //         name: "Testers",
              //         y: 2,
              //         color: "#393e46",
              //       },
              //       // { name: "Manager", y: 1, color: "#00adb5" },
              //       {
              //         name: "Devops",
              //         y: 3,
              //         color: "#eeeeee",
              //       },
              //       // { name: "Quality Analysts", y: 1, color: "#506ef9" },
              //       // change the value of y in order to change the data
              //     ],
              //   },
              // ],
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
            text: "Tasks/Issue's Timeline",
          },
          xAxis: {
            categories: this.tasksAreaProgress
              ? [...Object.values(this.tasksAreaProgress).map(({ x }) => x)]
              : [],
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
              data: this.tasksAreaProgress
                ? [...Object.values(this.tasksAreaProgress).map(({ y }) => y)]
                : [],
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
                  y: this.taskPriorityStatistics[TaskPriority.LOW],
                  sliced: true,
                  selected: true,
                },
                {
                  name: "Medium Priority Tasks",
                  y: this.taskPriorityStatistics[TaskPriority.MEDIUM],
                },
                {
                  name: "High Priority Tasks",
                  y: this.taskPriorityStatistics[TaskPriority.HIGH],
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
            categories: [...this.tasksStatusCount.names],
          },
          yAxis: {
            min: 0,
            max: this.tasksStatusCount.max,
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
              data: [...this.tasksStatusCount.in_progress],
            },
            {
              name: "Completed Tasks",
              data: [...this.tasksStatusCount.done],
              color: "lightgreen",
            },
            {
              name: "To-Do Tasks",
              data: [...this.tasksStatusCount.todo],
              color: "orange",
            },
          ],
        });
        // bar chart end
      });
    });
  }
}
