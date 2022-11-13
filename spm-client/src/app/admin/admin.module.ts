import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminTableComponent } from "./admin-table/admin-table.component";
import { AdminComponent } from "./admin.component";

@NgModule({
  declarations: [AdminComponent, AdminTableComponent],
  imports: [AdminRoutingModule, SharedModule],
})
export class AdminModule {}
