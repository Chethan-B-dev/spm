import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { UserRole } from "../shared/interfaces/user.interface";
import { EmployeeService } from "./employee.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated || !this.authService.checkRole(UserRole.EMPLOYEE)) {
      this.router.navigate(["/"]);
      return false;
    }
    this.employeeService.stateRefresh(this.authService.currentUser);
    return isAuthenticated;
  }
}
