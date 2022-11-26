import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import OrgChart from "@balkangraph/orgchart.js";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { TaskStatus } from "src/app/shared/interfaces/task.interface";
import {
  AvatarImage,
  UserRole,
} from "src/app/shared/interfaces/user.interface";
import { goBack, myTitleCase } from "src/app/shared/utility/common";
import { ReportsService } from "../services/reports.service";
@Component({
  selector: "app-org-chart-dashboard",
  templateUrl: "./org-chart-dashboard.component.html",
  styleUrls: ["./org-chart-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartDashboardComponent implements OnInit, OnDestroy {
  private projectId: number;
  private readonly currentUser = this.authService.currentUser;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly reportService: ReportsService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute
  ) {}

  goBack(): void {
    goBack();
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      this.projectId = +paramMap.get("projectId");
    });

    const projectObservable =
      this.currentUser.role === UserRole.MANAGER
        ? this.managerService.getProjectById(this.projectId)
        : this.employeeService.getProjectById(this.projectId);

    projectObservable.pipe(catchError(() => EMPTY)).subscribe((project) => {
      const tree = document.getElementById("tree");
      if (tree) {
        const chart = new OrgChart(tree, {
          template: "olivia",
          nodeBinding: {
            field_0: "name",
            img_0: "img",
            title_0: "title",
          },
        });
        chart.load(this.prepareData(project));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prepareData(project: IProject) {
    const data = [];
    data.push({
      id: project.manager.id,
      name: project.manager.username,
      title: myTitleCase(project.manager.role),
      img: project.manager.image || AvatarImage,
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
        title: myTitleCase(user.designation || user.role),
        img: user.image || AvatarImage,
        "Tasks Assigned": project.tasks.filter(
          (task) => task.user.id === user.id
        ).length,
        "User Rank": this.reportService.getEmployeeRank(project, user),
        "Total SubTasks Assigned To User":
          this.reportService.getTotalTodosOfUser(project, user),
        "Total Tasks that are In Progress":
          taskStatistics[TaskStatus.IN_PROGRESS],
        "Total Tasks Completed By User": taskStatistics[TaskStatus.COMPLETED],
        "Total Issues Raised By User": project.issues.filter(
          (issue) => issue.user.id === user.id
        ).length,
      });
    });
    return data;
  }
}
