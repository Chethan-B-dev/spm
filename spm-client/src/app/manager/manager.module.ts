import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SharedModule } from "../shared/shared.module";
import { ManagerProjectDetailComponent } from "./manager-project-detail/manager-project-detail.component";
import { RouterModule } from "@angular/router";
import { CreateTaskComponent } from "./dialogs/create-task/create-task.component";
import { ReactiveFormsModule } from "@angular/forms";

import { ManagerTaskDetailComponent } from "./manager-task-detail/manager-task-detail.component";
import { MaterialModule } from "../shared/material/material.module";
import { AddProjectComponent } from "./dialogs/add-project/add-project.component";
import { ShowEmployeesComponent } from "./dialogs/show-employees/show-employees.component";
import { ManagerScrumBoardComponent } from './manager-scrum-board/manager-scrum-board.component';
import { BoardDndComponent } from './manager-scrum-board/board-dnd/board-dnd.component';
import { BoardDndListComponent } from './manager-scrum-board/board-dnd-list/board-dnd-list.component';
import { IssueCardComponent } from './manager-scrum-board/issue-card/issue-card.component';
@NgModule({
  declarations: [
    DashboardComponent,
    ManagerProjectDetailComponent,
    CreateTaskComponent,
    ManagerTaskDetailComponent,
    AddProjectComponent,
    ShowEmployeesComponent,
    ManagerScrumBoardComponent,
    BoardDndComponent,
    BoardDndListComponent,
    IssueCardComponent,
  ],
  entryComponents: [
    CreateTaskComponent,
    AddProjectComponent,
    ShowEmployeesComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class ManagerModule {}
