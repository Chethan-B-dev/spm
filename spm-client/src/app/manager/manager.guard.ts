import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { UserRole } from "../shared/interfaces/user.interface";
import { ManagerService } from "./services/manager.service";

@Injectable({
  providedIn: "root",
})
export class ManagerGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated || !this.authService.checkRole(UserRole.MANAGER)) {
      this.router.navigate(["/"]);
      return false;
    }
    this.managerService.stateRefresh(this.authService.currentUser);
    return isAuthenticated;
  }
}
