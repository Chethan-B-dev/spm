import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EmployeeDashboardComponent } from "./employee/employee-dashboard/employee-dashboard.component";
import { EmployeeIssueDetailComponent } from "./employee/employee-issue-detail/employee-issue-detail.component";
import { EmployeeProjectDetailComponent } from "./employee/employee-project-detail/employee-project-detail.component";
import { EmployeeScrumBoardComponent } from "./employee/employee-scrum-board/employee-scrum-board.component";
import { DashboardComponent } from "./manager/dashboard/dashboard.component";
import { ManagerProjectDetailComponent } from "./manager/manager-project-detail/manager-project-detail.component";
import { ManagerScrumBoardComponent } from "./manager/manager-scrum-board/manager-scrum-board.component";
import { ManagerTaskDetailComponent } from "./manager/manager-task-detail/manager-task-detail.component";
import { BurnDownChartDashboardComponent } from "./reporting/burn-down-chart-dashboard/burn-down-chart-dashboard.component";
import { EmployeeReportsDashboardComponent } from "./reporting/employee-reports-dashboard/employee-reports-dashboard.component";
import { OrgChartDashboardComponent } from "./reporting/org-chart-dashboard/org-chart-dashboard.component";
import { EachProjectProgressBoardComponent } from "./reporting/progress-reports-dashboard/each-project-progress-board/each-project-progress-board.component";
import { ProgressReportsDashboardComponent } from "./reporting/progress-reports-dashboard/progress-reports-dashboard.component";
import { ReportsDashboardComponent } from "./reporting/reports-dashboard/reports-dashboard.component";
import { AdminComponent } from "./shared/admin/admin.component";
import { EditProfileComponent } from "./shared/dialogs/edit-profile/edit-profile.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "admin", component: AdminComponent },
  { path: "profile", component: EditProfileComponent },
  { path: "project-detail/:id", component: ManagerProjectDetailComponent },
  {
    path: "manager",
    component: DashboardComponent,
  },
  { path: "task-detail/:id", component: ManagerTaskDetailComponent },
  { path: "employee-dashboard", component: EmployeeDashboardComponent },
  {
    path: "employee-project-detail",
    component: EmployeeProjectDetailComponent,
  },
  { path: "employee-issue-detail", component: EmployeeIssueDetailComponent },
  { path: "employee-scrum-board", component: EmployeeScrumBoardComponent },
  {
    path: "manager-scrum-board/:taskId",
    component: ManagerScrumBoardComponent,
  },
  { path: "reporting-dashboard", component: ReportsDashboardComponent },
  { path: "reporting-progress-dashboard", component: ProgressReportsDashboardComponent  },
  { path: "reporting-burn-down-chart", component: BurnDownChartDashboardComponent },
  { path: "reporting-org-chart", component: OrgChartDashboardComponent },
  { path: "reporting-employee-dashboard", component: EmployeeReportsDashboardComponent },
  { path: "reporting-each-project-progress", component: EachProjectProgressBoardComponent },
  // this is for 404 request
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
