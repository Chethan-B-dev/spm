import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { SnackbarService } from "../shared/services/snackbar.service";
import { EmployeeService } from "./employee.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
    private router: Router,
    private readonly snackbarService: SnackbarService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated || !this.authService.isEmployee()) {
      this.snackbarService.showSnackBar("Not Authenticated");
      this.router.navigate(["/login"]);
      return false;
    }
    this.employeeService.stateRefresh(this.authService.currentUser);
    return true;
  }
}
