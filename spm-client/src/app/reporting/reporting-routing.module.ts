import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BurnDownChartDashboardComponent } from "./burn-down-chart-dashboard/burn-down-chart-dashboard.component";
import { EmpReportListComponent } from "./employee-reports-dashboard/emp-report-list/emp-report-list.component";
import { EmployeeReportsDashboardComponent } from "./employee-reports-dashboard/employee-reports-dashboard.component";
import { OrgChartDashboardComponent } from "./org-chart-dashboard/org-chart-dashboard.component";
import { EachProjectProgressBoardComponent } from "./progress-reports-dashboard/each-project-progress-board/each-project-progress-board.component";
import { ProgressReportsDashboardComponent } from "./progress-reports-dashboard/progress-reports-dashboard.component";
import { ReportsDashboardComponent } from "./reports-dashboard/reports-dashboard.component";

const routes: Routes = [
  { path: "", component: ReportsDashboardComponent },
  {
    path: "project-list",
    component: ProgressReportsDashboardComponent,
  },
  {
    path: "project-progress/:projectId",
    component: EachProjectProgressBoardComponent,
  },
  {
    path: "burn-down-chart/:projectId",
    component: BurnDownChartDashboardComponent,
  },
  { path: "emp-list/:projectId", component: EmpReportListComponent },
  {
    path: "employee-progress/:employeeId/:projectId",
    component: EmployeeReportsDashboardComponent,
  },
  { path: "org-chart/:projectId", component: OrgChartDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
