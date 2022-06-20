import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateTaskComponent } from "./dialogs/create-task/create-task.component";
import { ManagerProjectDetailComponent } from "./manager-project-detail/manager-project-detail.component";

import { MaterialModule } from "../shared/material/material.module";
import { AddProjectComponent } from "./dialogs/add-project/add-project.component";
import { CreateTodoComponent } from "./dialogs/create-todo/create-todo.component";
import { ShowEmployeesComponent } from "./dialogs/show-employees/show-employees.component";
import { ManagerRoutingModule } from "./manager-routing.module";
import { BoardDndListComponent } from "./manager-scrum-board/board-dnd-list/board-dnd-list.component";
import { BoardDndComponent } from "./manager-scrum-board/board-dnd/board-dnd.component";
import { IssueCardComponent } from "./manager-scrum-board/issue-card/issue-card.component";
import { ManagerScrumBoardComponent } from "./manager-scrum-board/manager-scrum-board.component";
import { ManagerTaskDetailComponent } from "./manager-task-detail/manager-task-detail.component";
import { SetDesignationComponent } from "./dialogs/set-designation/set-designation.component";

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
    CreateTodoComponent,
    SetDesignationComponent,
  ],
  entryComponents: [
    CreateTaskComponent,
    AddProjectComponent,
    ShowEmployeesComponent,
    CreateTodoComponent,
    SetDesignationComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ManagerRoutingModule,
  ],
})
export class ManagerModule {}
