import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { SnackbarService } from "../shared/services/snackbar.service";
import { ManagerService } from "./services/manager.service";

@Injectable({
  providedIn: "root",
})
export class ManagerGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
    private router: Router,
    private readonly snackbarService: SnackbarService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated || !this.authService.isManager()) {
      this.snackbarService.showSnackBar("Only Managers can Perform this action");
      this.router.navigate(["/login"]);
      return false;
    }
    this.managerService.stateRefresh(this.authService.currentUser);
    return true;
  }
}
