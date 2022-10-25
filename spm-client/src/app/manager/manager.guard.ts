import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
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
    private readonly router: Router
  ) {}
  canActivate(): boolean {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated || !this.authService.checkRole(UserRole.MANAGER)) {
      this.router.navigate(["/"]);
      return false;
    }
    this.managerService.stateRefresh(this.authService.currentUser);
    return isAuthenticated;
  }
}
