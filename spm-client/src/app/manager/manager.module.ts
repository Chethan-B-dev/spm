import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SharedModule } from "../shared/shared.module";
import { ManagerProjectDetailComponent } from "./manager-project-detail/manager-project-detail.component";
import { RouterModule } from "@angular/router";
import { CreateTaskComponent } from "./dialogs/create-task/create-task.component";
import { ReactiveFormsModule } from "@angular/forms";

import { ManagerTaskDetailComponent } from "./manager-task-detail/manager-task-detail.component";
import { MaterialModule } from "../shared/material/material.module";
@NgModule({
  declarations: [
    DashboardComponent,
    ManagerProjectDetailComponent,
    CreateTaskComponent,
    ManagerTaskDetailComponent,
  ],
  entryComponents: [CreateTaskComponent],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class ManagerModule {}
