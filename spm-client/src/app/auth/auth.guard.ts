import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { SnackbarService } from "../shared/services/snackbar.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const isAuthenticated = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    if (isAuthenticated && user) {
      this.router.navigate([`/${user.role.toLowerCase()}`]);
    } else {
      this.authService.logout();
      this.snackbarService.showSnackBar(
        "Please Login, Your session has Expired!"
      );
      this.router.navigate(["/login"]);
    }
    return isAuthenticated;
  }
}
