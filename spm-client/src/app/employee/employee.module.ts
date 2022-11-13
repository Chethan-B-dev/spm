import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { EmployeeProjectDetailComponent } from "./employee-project-detail/employee-project-detail.component";
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";
import { CreateIssueComponent } from "./employee-project-detail/Dialogs/create-issue/create-issue.component";
import { BoardDndComponent } from "./employee-scrum-board/board-dnd/board-dnd.component";
import { BoardDndListComponent } from "./employee-scrum-board/board-dnd-list/board-dnd-list.component";
import { EmployeeScrumBoardComponent } from "./employee-scrum-board/employee-scrum-board.component";
import { IssueCardComponent } from "./employee-scrum-board/issue-card/issue-card.component";
import { EmployeeRoutingModule } from "./employee-routing.module";

@NgModule({
  declarations: [
    EmployeeProjectDetailComponent,
    EmployeeDashboardComponent,
    CreateIssueComponent,
    EmployeeScrumBoardComponent,
    BoardDndComponent,
    BoardDndListComponent,
    IssueCardComponent,
  ],
  entryComponents: [CreateIssueComponent],
  imports: [ReactiveFormsModule, EmployeeRoutingModule, SharedModule],
})
export class EmployeeModule {}
