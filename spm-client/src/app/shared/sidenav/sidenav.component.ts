import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AddProjectComponent } from "src/app/manager/dialogs/add-project/add-project.component";
import { EditProfileComponent } from "../dialogs/edit-profile/edit-profile.component";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent {
  isExpanded: boolean = false;
  isLoginRoute: boolean = false;
  isRegisterRoute: boolean = true;
  isAuthenticated: boolean = true;
  isManager: boolean = true;
  isEmployee: boolean = false;

  constructor(public dialog: MatDialog) {}

  toggleSideNav(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleAuthButtons(): void {
    this.isLoginRoute = !this.isLoginRoute;
    this.isRegisterRoute = !this.isRegisterRoute;
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(AddProjectComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
