import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import {
  IAppUser,
  ILoginRequest,
  ILoginResponse,
  ISignUpRequest,
  UserRole,
} from "../shared/interfaces/user.interface";
import { handleError } from "../shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authUrl: string = "http://localhost:8080/api/login";
  private signUpUrl: string = "http://localhost:8080/api/auth/user/save";
  private currentUserSubject = new BehaviorSubject<IAppUser>(this.getUser());
  currentUser$: Observable<IAppUser> = this.currentUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): IAppUser {
    return this.currentUserSubject.value;
  }

  login(loginData: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.authUrl, loginData).pipe(
      tap((loginResponse) => this.manageUserState(loginResponse)),
      catchError(handleError)
    );
  }

  signup(signupData: ISignUpRequest): Observable<IAppUser> {
    return this.http
      .post<IAppUser>(this.signUpUrl, signupData)
      .pipe(catchError(handleError));
  }

  isLoggedIn(): boolean {
    const token: string = this.getToken();
    return (
      token &&
      !this.isTokenExpired(token) &&
      !!this.getUser() &&
      !!this.currentUser
    );
  }

  isManager(): boolean {
    const user: IAppUser = this.getUser();
    return user && user.role === UserRole.MANAGER;
  }

  isEmployee(): boolean {
    const user: IAppUser = this.getUser();
    return user && user.role === UserRole.EMPLOYEE;
  }

  isAdmin(): boolean {
    const user: IAppUser = this.getUser();
    return user && user.role === UserRole.ADMIN;
  }

  isTokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split(".")[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  manageUserState(loginResponse: ILoginResponse): void {
    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("user", JSON.stringify(loginResponse.user));
    this.setUser(loginResponse.user);
    this.isLoggedInSubject.next(true);
  }

  setUser(user: IAppUser): void {
    this.currentUserSubject.next(user);
  }

  getUser(): IAppUser {
    return JSON.parse(localStorage.getItem("user"));
  }

  getToken(): string {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setUser(null);
    this.isLoggedInSubject.next(false);
  }
}
