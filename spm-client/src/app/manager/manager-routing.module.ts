import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRole } from "../shared/interfaces/user.interface";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ManagerProjectDetailComponent } from "./manager-project-detail/manager-project-detail.component";
import { ManagerScrumBoardComponent } from "./manager-scrum-board/manager-scrum-board.component";
import { ManagerTaskDetailComponent } from "./manager-task-detail/manager-task-detail.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    data: { route: UserRole.MANAGER },
  },
  { path: "project-detail/:id", component: ManagerProjectDetailComponent },
  { path: "task-detail/:id", component: ManagerTaskDetailComponent },
  {
    path: "todo-detail/:taskId",
    component: ManagerScrumBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutingModule {}
