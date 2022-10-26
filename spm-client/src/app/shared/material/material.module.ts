// Angular
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Material imports
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatCommonModule } from "@angular/material";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

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
  MatTabsModule,
  MatAutocompleteModule,
  MatButtonToggleModule,
];

@NgModule({
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules],
})
export class MaterialModule {}
