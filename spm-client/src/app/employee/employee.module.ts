import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { EmployeeProjectDetailComponent } from './employee-project-detail/employee-project-detail.component';
import { EmployeeTaskDetailComponent } from './employee-task-detail/employee-task-detail.component';
import { EmployeeIssueDetailComponent } from './employee-issue-detail/employee-issue-detail.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [ EmployeeProjectDetailComponent, EmployeeTaskDetailComponent, EmployeeIssueDetailComponent, EmployeeDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    MatGridListModule
  ]
})
export class EmployeeModule { }
