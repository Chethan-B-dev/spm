import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "./admin/admin.guard";
import { AuthGuard } from "./auth/auth.guard";
import { LoggedInGuard } from "./auth/isloggedin.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EmployeeIssueDetailComponent } from "./employee/employee-issue-detail/employee-issue-detail.component";
import { EmployeeGuard } from "./employee/employee.guard";
import { ManagerGuard } from "./manager/manager.guard";
import { AdminComponent } from "./shared/admin/admin.component";
import { EditProfileComponent } from "./shared/dialogs/edit-profile/edit-profile.component";

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  // todo: move admin component to a module and lazy load it
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "profile", component: EditProfileComponent },
  {
    path: "manager",
    loadChildren: "./manager/manager.module#ManagerModule",
    canActivate: [ManagerGuard],
  },
  {
    path: "employee",
    loadChildren: "./employee/employee.module#EmployeeModule",
    canActivate: [EmployeeGuard],
  },
  {
    path: "reporting",
    loadChildren: "./reporting/reporting.module#ReportingModule",
    canActivate: [LoggedInGuard],
  },
  {
    path: "issue-detail/:id",
    component: EmployeeIssueDetailComponent,
    canActivate: [LoggedInGuard],
  },

  // this is for 404 request
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
