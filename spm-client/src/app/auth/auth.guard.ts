import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SnackbarService } from "../shared/services/snackbar.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService
  ) {}
  canActivate(): boolean {
    const isAuthenticated = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    if (isAuthenticated && user) {
      this.router.navigate([`/${user.role.toLowerCase()}`]);
    } else {
      this.authService.logout();
      this.snackbarService.showSnackBar(
        "Please Login, Your session might have Expired!"
      );
      this.router.navigate(["/login"]);
    }
    return isAuthenticated;
  }
}
