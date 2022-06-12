import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Material imports
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatBadgeModule } from "@angular/material/badge";
import { MatRippleModule } from "@angular/material/core";
import { MatCommonModule } from "@angular/material";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatListModule,
  MatBadgeModule,
  MatMenuModule,
  MatCardModule,
  MatDialogModule,
  MatTooltipModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatCommonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatGridListModule,
  MatProgressBarModule,
  DragDropModule,
  MatExpansionModule,
  MatTabsModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules],
})
export class MaterialModule {}
