import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    console.log("admin guard getting called");
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(["/login"]);
    }
    const isAdmin = this.authService.isAdmin();
    if (!isAdmin) this.router.navigate(["/"]);
    return isAdmin;
  }
}
