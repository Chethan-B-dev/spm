import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsDashboardComponent } from './reports-dashboard/reports-dashboard.component';
import { MaterialModule } from "../shared/material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { ProgressReportsDashboardComponent } from './progress-reports-dashboard/progress-reports-dashboard.component';
import { BurnDownChartDashboardComponent } from './burn-down-chart-dashboard/burn-down-chart-dashboard.component';
import { OrgChartDashboardComponent } from './org-chart-dashboard/org-chart-dashboard.component';
import { EmployeeReportsDashboardComponent } from './employee-reports-dashboard/employee-reports-dashboard.component';
import { EachProjectProgressBoardComponent } from './progress-reports-dashboard/each-project-progress-board/each-project-progress-board.component';

@NgModule({
  declarations: [ReportsDashboardComponent, ProgressReportsDashboardComponent, BurnDownChartDashboardComponent, OrgChartDashboardComponent, EmployeeReportsDashboardComponent, EachProjectProgressBoardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class ReportingModule { }
