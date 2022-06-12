import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "./admin/admin.guard";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EmployeeDashboardComponent } from "./employee/employee-dashboard/employee-dashboard.component";
import { EmployeeIssueDetailComponent } from "./employee/employee-issue-detail/employee-issue-detail.component";
import { EmployeeProjectDetailComponent } from "./employee/employee-project-detail/employee-project-detail.component";
import { EmployeeScrumBoardComponent } from "./employee/employee-scrum-board/employee-scrum-board.component";
import { ManagerGuard } from "./manager/manager.guard";
import { AdminComponent } from "./shared/admin/admin.component";
import { EditProfileComponent } from "./shared/dialogs/edit-profile/edit-profile.component";

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "profile", component: EditProfileComponent },
  {
    path: "manager",
    loadChildren: "./manager/manager.module#ManagerModule",
    canActivate: [ManagerGuard],
  },
  { path: "employee", component: EmployeeDashboardComponent },
  {
    path: "employee-project-detail",
    component: EmployeeProjectDetailComponent,
  },
  { path: "employee-issue-detail", component: EmployeeIssueDetailComponent },
  { path: "employee-scrum-board", component: EmployeeScrumBoardComponent },

  // this is for 404 request
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ManagerGuard, AdminGuard, AuthGuard],
})
export class AppRoutingModule {}
