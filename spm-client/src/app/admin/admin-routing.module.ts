import { AdminTableComponent } from "./admin-table/admin-table.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { UserRole } from "../shared/interfaces/user.interface";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    data: { route: UserRole.ADMIN },
  },
  {
    path: "table",
    component: AdminTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
