import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { SnackbarService } from "../shared/services/snackbar.service";

@Injectable({
  providedIn: "root",
})
export class EmployeeGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private readonly snackbarService: SnackbarService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    console.log("employee guard getting called");
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated) {
      this.snackbarService.showSnackBar("Not Authenticated");
      this.router.navigate(["/login"]);
    }
    const isEmployee = this.authService.isEmployee();
    if (!isEmployee) this.router.navigate(["/"]);
    return isEmployee;
  }
}
