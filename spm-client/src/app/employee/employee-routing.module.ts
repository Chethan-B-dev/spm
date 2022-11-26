import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserRole } from "../shared/interfaces/user.interface";
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";
import { EmployeeProjectDetailComponent } from "./employee-project-detail/employee-project-detail.component";
import { EmployeeScrumBoardComponent } from "./employee-scrum-board/employee-scrum-board.component";

const routes: Routes = [
  {
    path: "",
    component: EmployeeDashboardComponent,
    data: { route: UserRole.EMPLOYEE },
  },
  { path: "project-detail/:id", component: EmployeeProjectDetailComponent },
  { path: "task-detail/:id", component: EmployeeScrumBoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
