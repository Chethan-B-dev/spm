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

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    const isAuthenticated = this.authService.isLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(["/login"]);
    }
    return this.authService.isAdmin();
  }
}
