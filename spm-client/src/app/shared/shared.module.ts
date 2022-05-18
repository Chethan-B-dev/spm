import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { RouterModule } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";

import { ConfirmDeleteComponent } from "./dialogs/confirm-delete/confirm-delete.component";
import { EditProfileComponent } from "./dialogs/edit-profile/edit-profile.component";
import { AuthModule } from "../auth/auth.module";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";

import { ProjectCardComponent } from "./project-card/project-card.component";
import { SpacingDirective } from "./spacing.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { TaskCardComponent } from "./task-card/task-card.component";
import { MaterialModule } from "./material/material.module";
import { NotifcationMenuComponent } from "./notifcation-menu/notifcation-menu.component";
import { TopNavComponent } from "./top-nav/top-nav.component";

@NgModule({
  declarations: [
    SidenavComponent,
    AdminComponent,
    ConfirmDeleteComponent,
    EditProfileComponent,
    ProgressBarComponent,
    ProjectCardComponent,
    SpacingDirective,
    LoadingSpinnerComponent,
    PieChartComponent,
    TaskCardComponent,
    NotifcationMenuComponent,
    TopNavComponent,
  ],
  entryComponents: [ConfirmDeleteComponent],
  imports: [RouterModule, CommonModule, AuthModule, MaterialModule],
  exports: [
    SidenavComponent,
    AdminComponent,
    ConfirmDeleteComponent,
    EditProfileComponent,
    ProgressBarComponent,
    ProjectCardComponent,
    TaskCardComponent,
    SpacingDirective,
    LoadingSpinnerComponent,
    PieChartComponent,
    TopNavComponent,
  ],
})
export class SharedModule {}
