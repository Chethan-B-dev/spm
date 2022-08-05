import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SidenavComponent } from "./sidenav/sidenav.component";

import { AuthModule } from "../auth/auth.module";
import { ConfirmDeleteComponent } from "./dialogs/confirm-delete/confirm-delete.component";
import { EditProfileComponent } from "./dialogs/edit-profile/edit-profile.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";

import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { ProjectCardComponent } from "./project-card/project-card.component";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShowEmployeesComponent } from "../manager/dialogs/show-employees/show-employees.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { MaterialModule } from "./material/material.module";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { TaskCardComponent } from "./task-card/task-card.component";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from "src/environments/environment";
import { AddProjectComponent } from "../manager/dialogs/add-project/add-project.component";
import { UploadComponent } from "./upload/upload.component";
import { ImageSliderComponent } from "./dialogs/image-slider/image-slider.component";
import { MatCarouselModule } from "@ngmodule/material-carousel";

@NgModule({
  declarations: [
    SidenavComponent,
    ConfirmDeleteComponent,
    EditProfileComponent,
    ProgressBarComponent,
    ProjectCardComponent,
    LoadingSpinnerComponent,
    PieChartComponent,
    TaskCardComponent,
    IssueDetailComponent,
    ShowEmployeesComponent,
    AddProjectComponent,
    UploadComponent,
    ImageSliderComponent,
  ],
  entryComponents: [
    ConfirmDeleteComponent,
    ShowEmployeesComponent,
    AddProjectComponent,
    ImageSliderComponent,
  ],
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
    AngularFireStorageModule,
    MatCarouselModule.forRoot(),
  ],
  exports: [
    SidenavComponent,
    ConfirmDeleteComponent,
    EditProfileComponent,
    ProgressBarComponent,
    ProjectCardComponent,
    TaskCardComponent,
    LoadingSpinnerComponent,
    PieChartComponent,
    UploadComponent,
    ImageSliderComponent,
  ],
})
export class SharedModule {}
