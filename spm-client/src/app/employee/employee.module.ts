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
import { BoardDndComponent } from './employee-scrum-board/board-dnd/board-dnd.component';
import { BoardDndListComponent } from './employee-scrum-board/board-dnd-list/board-dnd-list.component';
import { IssueCardComponent } from './employee-scrum-board/issue-card/issue-card.component';
import { SimpleDivComponent } from './employee-scrum-board/simple-div/simple-div.component';


@NgModule({
  declarations: [ EmployeeProjectDetailComponent,
     EmployeeIssueDetailComponent,
      EmployeeDashboardComponent,
       CreateIssueComponent,
       EmployeeScrumBoardComponent,
       BoardDndComponent,
       BoardDndListComponent,
       IssueCardComponent,
       SimpleDivComponent],
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
