import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "./admin/admin.guard";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EmployeeDashboardComponent } from "./employee/employee-dashboard/employee-dashboard.component";
import { EmployeeIssueDetailComponent } from "./employee/employee-issue-detail/employee-issue-detail.component";
import { EmployeeProjectDetailComponent } from "./employee/employee-project-detail/employee-project-detail.component";
import { EmployeeScrumBoardComponent } from "./employee/employee-scrum-board/employee-scrum-board.component";
import { ManagerGuard } from "./manager/manager.guard";
import { BurnDownChartDashboardComponent } from "./reporting/burn-down-chart-dashboard/burn-down-chart-dashboard.component";
import { EmployeeReportsDashboardComponent } from "./reporting/employee-reports-dashboard/employee-reports-dashboard.component";
import { OrgChartDashboardComponent } from "./reporting/org-chart-dashboard/org-chart-dashboard.component";
import { EachProjectProgressBoardComponent } from "./reporting/progress-reports-dashboard/each-project-progress-board/each-project-progress-board.component";
import { ProgressReportsDashboardComponent } from "./reporting/progress-reports-dashboard/progress-reports-dashboard.component";
import { ReportsDashboardComponent } from "./reporting/reports-dashboard/reports-dashboard.component";
import { AdminComponent } from "./shared/admin/admin.component";
import { EditProfileComponent } from "./shared/dialogs/edit-profile/edit-profile.component";

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "signup", component: SignupComponent },
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "profile", component: EditProfileComponent },
  {
    path: "manager",
    loadChildren: "./manager/manager.module#ManagerModule",
    canActivate: [ManagerGuard],
  },
  { path: "employee-dashboard", component: EmployeeDashboardComponent },
  {
    path: "employee-project-detail",
    component: EmployeeProjectDetailComponent,
  },
  { path: "employee-issue-detail", component: EmployeeIssueDetailComponent },
  { path: "employee-scrum-board", component: EmployeeScrumBoardComponent },

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
  providers: [ManagerGuard, AdminGuard, AuthGuard],
})
export class AppRoutingModule {}
