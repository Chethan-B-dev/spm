import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { EmployeeProjectDetailComponent } from './employee-project-detail/employee-project-detail.component';
import { EmployeeIssueDetailComponent } from './employee-issue-detail/employee-issue-detail.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { CreateIssueComponent } from './employee-project-detail/Dialogs/create-issue/create-issue.component';
import { EmployeeScrumBoardComponent } from './employee-scrum-board/employee-scrum-board.component';


@NgModule({
  declarations: [ EmployeeProjectDetailComponent,
     EmployeeIssueDetailComponent,
      EmployeeDashboardComponent,
       CreateIssueComponent,
       EmployeeScrumBoardComponent],
       entryComponents: [CreateIssueComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class EmployeeModule { }
