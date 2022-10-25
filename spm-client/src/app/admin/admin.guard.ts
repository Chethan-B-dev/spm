import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { UserRole } from "../shared/interfaces/user.interface";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated || !this.authService.checkRole(UserRole.ADMIN)) {
      this.router.navigate(["/"]);
      return false;
    }
    return isAuthenticated;
  }
}
