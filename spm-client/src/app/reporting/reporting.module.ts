import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsDashboardComponent } from './reports-dashboard/reports-dashboard.component';
import { MaterialModule } from "../shared/material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ReportsDashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class ReportingModule { }
