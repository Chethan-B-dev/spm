import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { AddProjectComponent } from "src/app/manager/dialogs/add-project/add-project.component";
import { EditProfileComponent } from "../dialogs/edit-profile/edit-profile.component";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit {
  isExpanded: boolean = false;
  isManager$: Observable<boolean>;
  isEmployee$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isAdmin()))
    );
    this.isManager$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isManager()))
    );
    this.isEmployee$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isEmployee()))
    );
  }

  toggleSideNav(): void {
    this.isExpanded = !this.isExpanded;
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(AddProjectComponent);
    dialogRef.afterClosed().subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
