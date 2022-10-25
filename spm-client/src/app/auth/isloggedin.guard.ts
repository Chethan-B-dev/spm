import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  canActivate(): boolean {
    const isAuthenticated = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    if (!isAuthenticated || !user) {
      this.authService.logout();
      this.router.navigate(["/login"]);
    }
    return isAuthenticated;
  }
}
