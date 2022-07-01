import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { UserRole } from "../shared/interfaces/user.interface";
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
      switch (user.role) {
        case UserRole.MANAGER:
          this.router.navigate(["/manager"]);
          break;
        case UserRole.EMPLOYEE:
          this.router.navigate(["/employee"]);
          break;
        case UserRole.ADMIN:
          this.router.navigate(["/admin"]);
          break;
      }
    } else {
      this.router.navigate(["/login"]);
    }
    return isAuthenticated;
  }
}
