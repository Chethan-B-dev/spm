import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import OrgChart from "@balkangraph/orgchart.js";
import { EMPTY, Subject, Subscription } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { TaskStatus } from "src/app/shared/interfaces/task.interface";
import {
  avatarImage,
  UserRole,
} from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { myTitleCase } from "src/app/shared/utility/common";
import { ReportsService } from "../services/reports.service";
@Component({
  selector: "app-org-chart-dashboard",
  templateUrl: "./org-chart-dashboard.component.html",
  styleUrls: ["./org-chart-dashboard.component.scss"],
})
export class OrgChartDashboardComponent implements OnInit, OnDestroy {
  projectId: number;
  private readonly currentUser = this.authService.currentUser;
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly reportService: ReportsService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService,
    private readonly authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = +paramMap.get("projectId");
    });

    const projectObservable =
      this.currentUser.role === UserRole.MANAGER
        ? this.managerService.getProjectById(this.projectId)
        : this.employeeService.getProjectById(this.projectId);

    const projectSubscription = projectObservable
      .pipe(
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((project) => {
        const tree = document.getElementById("tree");
        if (tree) {
          const chart = new OrgChart(tree, {
            nodeBinding: {
              field_0: "name",
              img_0: "img",
              title_0: "title",
            },
          });
          chart.load(this.prepareData(project));
        }
      });

    this.subscriptions.push(projectSubscription);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private prepareData(project: IProject) {
    const data = [];
    data.push({
      id: project.manager.id,
      name: project.manager.username,
      title: myTitleCase(project.manager.role),
      img: project.manager.image || avatarImage,
    });
    project.users.forEach((user) => {
      const taskStatistics = this.reportService.getUserTaskStatistics(
        project,
        user
      );
      data.push({
        id: user.id,
        pid: project.manager.id,
        name: user.username,
        title: myTitleCase(user.designation),
        img: user.image || avatarImage,
        Tasks_Assigned: project.tasks.filter((task) => task.user.id === user.id)
          .length,
        Rank: this.reportService.getEmployeeRank(project, user),
        Total_SubTasks: this.reportService.getTotalTodosOfUser(project, user),
        In_Progress_Tasks: taskStatistics[TaskStatus.IN_PROGRESS],
        Completed_Tasks: taskStatistics[TaskStatus.COMPLETED],
        Issues_Raised: project.issues.filter(
          (issue) => issue.user.id === user.id
        ).length,
      });
    });
    return data;
  }
}
