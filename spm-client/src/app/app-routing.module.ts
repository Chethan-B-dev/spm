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
import { CustomPreloadingStrategy } from "./shared/services/custom-preload-strategy.service";

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
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: "manager",
    loadChildren: () =>
      import("./manager/manager.module").then((m) => m.ManagerModule),
    canActivate: [ManagerGuard],
    data: { preload: true },
  },
  {
    path: "employee",
    loadChildren: () =>
      import("./employee/employee.module").then((m) => m.EmployeeModule),
    canActivate: [EmployeeGuard],
    data: { preload: true },
  },
  {
    path: "reporting",
    loadChildren: () =>
      import("./reporting/reporting.module").then((m) => m.ReportingModule),
    canActivate: [LoggedInGuard],
  },
  // 404 route
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule {}
