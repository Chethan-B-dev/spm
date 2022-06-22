import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeeDashboardComponent } from "./employee-dashboard/employee-dashboard.component";
import { EmployeeIssueDetailComponent } from "./employee-issue-detail/employee-issue-detail.component";
import { EmployeeProjectDetailComponent } from "./employee-project-detail/employee-project-detail.component";
import { EmployeeScrumBoardComponent } from "./employee-scrum-board/employee-scrum-board.component";

const routes: Routes = [
  {
    path: "",
    component: EmployeeDashboardComponent,
  },
  { path: "project-detail/:id", component: EmployeeProjectDetailComponent },
  { path: "task-detail/:id", component: EmployeeScrumBoardComponent },
  { path: "issue-detail/:id", component: EmployeeIssueDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
