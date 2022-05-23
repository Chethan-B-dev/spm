import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { IAppUser } from "../interfaces/user.interface";

import { tap, catchError } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { handleError } from "../utility/error";

@Injectable({
  providedIn: "root",
})
export class AdminApiService {
  private usersUrl = "http://localhost:8080/api/admin";
  private userCategorySelectedSubject = new BehaviorSubject<string>(
    "UNVERIFIED"
  );
  userCategorySelectedAction = this.userCategorySelectedSubject.asObservable();

  private refreshSubject = new BehaviorSubject(null);

  get refresh() {
    return this.refreshSubject.asObservable();
  }

  // todo: headers for temp testing of jwt, later replace with HTTP interceptor
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTY1NDM1NTgyOSwiaWF0IjoxNjUzMjc1ODI5fQ._T9mPMiWotf93PCZvtXJJjrWgqObs1E6YQtmKUwdr7qGWlzgjSXtFqHK70Abm5iZKL9_suuonqf8oxfYIhEkpw",
  });

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(this.usersUrl, { headers: this.headers })
      .pipe(catchError(handleError));
  }

  selectUserCategory(selectedUserCategory: string): void {
    this.userCategorySelectedSubject.next(selectedUserCategory);
  }

  takeDecision(userId: number, adminDecision: string): Observable<IAppUser> {
    const requestBody = { userId, adminDecision };
    return this.http
      .post<IAppUser>(`${this.usersUrl}/take-decision`, requestBody, {
        headers: this.headers,
      })
      .pipe(
        tap((response) => this.refreshSubject.next(null)),
        catchError(handleError)
      );
  }

  enableUser(userId: number): Observable<IAppUser> {
    return this.http
      .get<IAppUser>(`${this.usersUrl}/enable/${userId}`, {
        headers: this.headers,
      })
      .pipe(
        tap((response) => this.refreshSubject.next(null)),
        catchError(handleError)
      );
  }
}
