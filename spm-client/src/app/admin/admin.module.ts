import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminTableComponent } from "./admin-table/admin-table.component";
import { AdminComponent } from "./admin.component";
import { ColumnSelectorComponent } from "./column-selector/column-selector.component";

@NgModule({
  declarations: [AdminComponent, AdminTableComponent, ColumnSelectorComponent],
  imports: [AdminRoutingModule, SharedModule],
  entryComponents: [ColumnSelectorComponent],
})
export class AdminModule {}
