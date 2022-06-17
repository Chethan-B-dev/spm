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
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material/material.module";
import { NotifcationMenuComponent } from "./notifcation-menu/notifcation-menu.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { AdminApiService } from "./services/admin-api.service";
import { SnackbarService } from "./services/snackbar.service";
import { TaskCardComponent } from "./task-card/task-card.component";
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
    NotifcationMenuComponent,
  ],
  entryComponents: [ConfirmDeleteComponent],
  imports: [
    RouterModule,
    CommonModule,
    AuthModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
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
