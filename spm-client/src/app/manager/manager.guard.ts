import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { SnackbarService } from "../shared/services/snackbar.service";

@Injectable({
  providedIn: "root",
})
export class ManagerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    console.log("manager guard getting called");
    const isAuthenticated: boolean = this.authService.isLoggedIn();
    if (!isAuthenticated) {
      this.snackbarService.showSnackBar("Not Authenticated");
      this.router.navigate(["/login"]);
    }
    const isManager: boolean = this.authService.isManager();
    if (!isManager) this.router.navigate(["/"]);
    return isManager;
  }
}
