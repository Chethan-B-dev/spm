import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "./admin/admin.guard";
import { AuthGuard } from "./auth/auth.guard";
import { LoggedInGuard } from "./auth/isloggedin.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EmployeeGuard } from "./employee/employee.guard";
import { ManagerGuard } from "./manager/manager.guard";
import { EditProfileComponent } from "./shared/dialogs/edit-profile/edit-profile.component";
import { IssueDetailComponent } from "./shared/issue-detail/issue-detail.component";

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "profile", component: EditProfileComponent },
  {
    path: "issue-detail/:id",
    component: IssueDetailComponent,
    canActivate: [LoggedInGuard],
  },
  // lazy loaded modules
  {
    path: "admin",
    loadChildren: "./admin/admin.module#AdminModule",
    canActivate: [AdminGuard],
  },
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
  // 404 route
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
