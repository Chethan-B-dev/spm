import { ChangeDetectionStrategy } from "@angular/core";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { UserRole } from "src/app/shared/interfaces/user.interface";
import { goBack } from "src/app/shared/utility/common";
import { ReportsService } from "../services/reports.service";
declare let Highcharts: any;

@Component({
  selector: "app-burn-down-chart-dashboard",
  templateUrl: "./burn-down-chart-dashboard.component.html",
  styleUrls: ["./burn-down-chart-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BurnDownChartDashboardComponent implements OnInit, OnDestroy {
  project: IProject;
  projectId: number;
  currentUser = this.authService.currentUser;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly route: ActivatedRoute,
    private readonly reportsService: ReportsService,
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = +paramMap.get("projectId");
    });

    const project$ =
      this.currentUser.role === UserRole.MANAGER
        ? this.managerService.getProjectById(this.projectId)
        : this.employeeService.getProjectById(this.projectId);

    project$
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => EMPTY)
      )
      .subscribe((project) => {
        this.project = project;
        const ideal = this.reportsService.getIdealBurn(this.project);
        const idealProject = this.reportsService.getIdealBurnDataProject(
          this.project
        );
        const actual = this.reportsService.getActualBurnData(this.project);
        const actualIssues = this.reportsService.getActualBurnDataIssues(
          this.project
        );
        const actualProject = this.reportsService.getActualBurnDataProject(
          this.project
        );

        // Over all progress burn down charts
        Highcharts.chart("overall-burndown", {
          chart: {
            backgroundColor: "white",
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
          labels: {
            formatter: function () {
              return this.value;
            },
          },
          title: {
            text: "Project Burndown Chart",
          },
          credits: {
            enabled: false,
          },
          colors: ["blue", "red"],
          subtitle: {
            text: `Overall Burndown for the Project: ${project.name} (x-axis: No. of Days, y-axis: No. of Tasks & Issues)`,
          },

          yAxis: {
            title: {
              text: "Tasks Count",
            },

            xAxis: {
              title: {
                text: "Days",
              },
              type: "datetime",
              categories: actual
                ? [...Object.values(actual).map(({ x }) => x)]
                : [],
              allowDecimals: false,
            },

            plotLines: [
              {
                value: 0,
                width: 1,
              },
            ],
          },
          tooltip: {
            valueSuffix: "No. of Tasks",
            crosshairs: true,
            shared: true,
          },
          legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            borderWidth: 0,
          },
          series: [
            {
              name: "Ideal Burn",
              color: "green",
              lineWidth: 2,
              data: idealProject,
            },
            {
              name: "Actual Burn",
              color: "orange",
              marker: {
                radius: 6,
              },
              data: actualProject
                ? [...Object.values(actualProject).map(({ y }) => y)]
                : [],
            },
          ],
        });

        // Issues burn down charts
        Highcharts.chart("issues-burndown", {
          chart: {
            backgroundColor: "#f7f7f5",
          },
          title: {
            text: "Issue Burndown Chart",
          },
          credits: {
            enabled: false,
          },
          colors: ["green", "red"],
          subtitle: {
            text: `Issues Burndown for the Project: ${project.name} (x-axis: No. of Days, y-axis: No. of Issues)`,
          },

          yAxis: {
            title: {
              text: "No. of Tasks",
            },

            xAxis: {
              title: {
                text: "Days",
              },
              categories: [
                "Day 1",
                "Day 2",
                "Day 3",
                "Day 4",
                "Day 5",
                "Day 6",
                "Day 7",
                "Day 8",
                "Day 9",
                "Day 10",
                "Day 11",
                "Day 12",
              ],
            },

            plotLines: [
              {
                value: 0,
                width: 1,
              },
            ],
          },
          tooltip: {
            valueSuffix: "No. of Tasks",
            crosshairs: true,
            shared: true,
          },
          legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            borderWidth: 0,
          },
          series: [
            {
              name: "Ideal Burn",
              color: "green",
              lineWidth: 2,
              data: ideal,
            },
            {
              name: "Actual Burn",
              color: "red",
              marker: {
                radius: 6,
              },
              data: actualIssues
                ? [...Object.values(actualIssues).map(({ y }) => y)]
                : [],
            },
          ],
        });

        // Tasks burn down charts
        Highcharts.chart("tasks-burndown", {
          title: {
            text: "Tasks Burndown Chart",
          },
          credits: {
            enabled: false,
          },
          colors: ["green", "red"],
          subtitle: {
            text: `Tasks Burndown for the Project: ${project.name} (x-axis: No. of Days, y-axis: No. of Tasks)`,
          },

          yAxis: {
            title: {
              text: "No. of Tasks",
            },

            xAxis: {
              title: {
                text: "Days",
              },
              categories: [
                "Day 1",
                "Day 2",
                "Day 3",
                "Day 4",
                "Day 5",
                "Day 6",
                "Day 7",
                "Day 8",
                "Day 9",
                "Day 10",
                "Day 11",
                "Day 12",
              ],
            },

            plotLines: [
              {
                value: 0,
                width: 1,
              },
            ],
          },
          tooltip: {
            valueSuffix: "No. of Tasks",
            crosshairs: true,
            shared: true,
          },
          legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
            borderWidth: 0,
          },
          series: [
            {
              name: "Ideal Burn",
              color: "rgba(255,0,0,0.25)",
              lineWidth: 2,
              data: ideal,
            },
            {
              name: "Actual Burn",
              color: "rgba(0,120,200,0.75)",
              marker: {
                radius: 6,
              },
              data: actual ? [...Object.values(actual).map(({ y }) => y)] : [],
            },
          ],
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    goBack();
  }
}
