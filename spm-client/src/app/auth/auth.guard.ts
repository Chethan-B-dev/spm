import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private router: Router
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
      this.router.navigate(["/login"]);
    }
    return isAuthenticated;
  }
}
