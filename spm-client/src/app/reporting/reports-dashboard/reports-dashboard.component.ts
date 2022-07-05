import { Component, OnDestroy, OnInit } from "@angular/core";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser, UserRole } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

declare let Highcharts: any;

@Component({
  selector: "app-reports-dashboard",
  templateUrl: "./reports-dashboard.component.html",
  styleUrls: ["./reports-dashboard.component.scss"],
})
export class ReportsDashboardComponent implements OnInit, OnDestroy {
  currentUser: IAppUser;
  projects$: Observable<IProject[]>;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.currentUser = user));

    const userProjects$ =
      this.currentUser.role === UserRole.MANAGER
        ? this.managerService.projects$
        : this.employeeService.projects$;

    this.projects$ = userProjects$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    Highcharts.chart("progress-chart-container", {
      title: {
        text: "Solar Employment Growth by Sector, 2010-2016",
      },

      subtitle: {
        text: "Source: thesolarfoundation.com",
      },

      yAxis: {
        title: {
          text: "Number of Employees",
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: "Range: 2010 to 2017",
        },
      },

      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },

      series: [
        {
          name: "Installation",
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
        },
        {
          name: "Manufacturing",
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
        },
        {
          name: "Sales & Distribution",
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
        },
        {
          name: "Project Development",
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
        },
        {
          name: "Other",
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 5000,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
