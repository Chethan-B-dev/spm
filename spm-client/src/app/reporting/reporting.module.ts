import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { BurnDownChartDashboardComponent } from "./burn-down-chart-dashboard/burn-down-chart-dashboard.component";
import { EmpReportListComponent } from "./employee-reports-dashboard/emp-report-list/emp-report-list.component";
import { EmployeeReportsDashboardComponent } from "./employee-reports-dashboard/employee-reports-dashboard.component";
import { OrgChartDashboardComponent } from "./org-chart-dashboard/org-chart-dashboard.component";
import { EachProjectProgressBoardComponent } from "./progress-reports-dashboard/each-project-progress-board/each-project-progress-board.component";
import { ProgressReportsDashboardComponent } from "./progress-reports-dashboard/progress-reports-dashboard.component";
import { ReportingRoutingModule } from "./reporting-routing.module";
import { ReportsDashboardComponent } from "./reports-dashboard/reports-dashboard.component";

@NgModule({
  declarations: [
    ReportsDashboardComponent,
    ProgressReportsDashboardComponent,
    BurnDownChartDashboardComponent,
    OrgChartDashboardComponent,
    EmployeeReportsDashboardComponent,
    EachProjectProgressBoardComponent,
    EmpReportListComponent,
  ],
  imports: [SharedModule, ReportingRoutingModule],
})
export class ReportingModule {}
