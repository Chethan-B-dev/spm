import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateTaskComponent } from "./dialogs/create-task/create-task.component";
import { ManagerProjectDetailComponent } from "./manager-project-detail/manager-project-detail.component";

import { MaterialModule } from "../shared/material/material.module";
import { CreateTodoComponent } from "./dialogs/create-todo/create-todo.component";
import { SetDesignationComponent } from "./dialogs/set-designation/set-designation.component";
import { ManagerRoutingModule } from "./manager-routing.module";
import { BoardDndListComponent } from "./manager-scrum-board/board-dnd-list/board-dnd-list.component";
import { BoardDndComponent } from "./manager-scrum-board/board-dnd/board-dnd.component";
import { IssueCardComponent } from "./manager-scrum-board/issue-card/issue-card.component";
import { ManagerScrumBoardComponent } from "./manager-scrum-board/manager-scrum-board.component";
import { ManagerTaskDetailComponent } from "./manager-task-detail/manager-task-detail.component";
import { EditProjectComponent } from "./dialogs/edit-project/edit-project.component";

@NgModule({
  declarations: [
    DashboardComponent,
    ManagerProjectDetailComponent,
    CreateTaskComponent,
    ManagerTaskDetailComponent,
    ManagerScrumBoardComponent,
    BoardDndComponent,
    BoardDndListComponent,
    IssueCardComponent,
    CreateTodoComponent,
    SetDesignationComponent,
    EditProjectComponent,
  ],
  entryComponents: [
    CreateTaskComponent,
    CreateTodoComponent,
    SetDesignationComponent,
    EditProjectComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ManagerRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class ManagerModule {}
