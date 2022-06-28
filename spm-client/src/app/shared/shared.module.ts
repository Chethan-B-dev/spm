import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { SidenavComponent } from "./sidenav/sidenav.component";

import { AuthModule } from "../auth/auth.module";
import { ConfirmDeleteComponent } from "./dialogs/confirm-delete/confirm-delete.component";
import { EditProfileComponent } from "./dialogs/edit-profile/edit-profile.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";

import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { ProjectCardComponent } from "./project-card/project-card.component";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmployeeIssueDetailComponent } from "../employee/employee-issue-detail/employee-issue-detail.component";
import { ShowEmployeesComponent } from "../manager/dialogs/show-employees/show-employees.component";
import { MaterialModule } from "./material/material.module";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { AdminApiService } from "./services/admin-api.service";
import { SnackbarService } from "./services/snackbar.service";
import { TaskCardComponent } from "./task-card/task-card.component";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "src/environments/environment";
@NgModule({
  declarations: [
    SidenavComponent,
    AdminComponent,
    ConfirmDeleteComponent,
    EditProfileComponent,
    ProgressBarComponent,
    ProjectCardComponent,
    LoadingSpinnerComponent,
    PieChartComponent,
    TaskCardComponent,
    EmployeeIssueDetailComponent,
    ShowEmployeesComponent,
  ],
  entryComponents: [ConfirmDeleteComponent, ShowEmployeesComponent],
  imports: [
    RouterModule,
    CommonModule,
    AuthModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  exports: [
    SidenavComponent,
    AdminComponent,
    ConfirmDeleteComponent,
    EditProfileComponent,
    ProgressBarComponent,
    ProjectCardComponent,
    TaskCardComponent,
    LoadingSpinnerComponent,
    PieChartComponent,
  ],
  providers: [AdminApiService, SnackbarService],
})
export class SharedModule {}
