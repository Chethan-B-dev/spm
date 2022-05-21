import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { IAppUser } from "../interfaces/user.interface";

import { tap, catchError } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";

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
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJFTVBMT1lFRSIsImV4cCI6MTY1MzE0MDk0MCwiaWF0IjoxNjUzMTIyOTQwfQ.sATfhxTqgq4NzhrElR9mL4zKrFURWhyCHPil9cIy0HhFJeDEL883UrYRxnIHsDS2jh9zg0Tj5wJr6D2SNncvOA",
  });

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(this.usersUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
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
        catchError(this.handleError)
      );
  }

  enableUser(userId: number): Observable<IAppUser> {
    return this.http
      .get<IAppUser>(`${this.usersUrl}/enable/${userId}`, {
        headers: this.headers,
      })
      .pipe(
        tap((response) => this.refreshSubject.next(null)),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    // let errorMessage: string;
    // if (err.error instanceof ErrorEvent) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   errorMessage = `An error occurred: ${err.error.message}`;
    // } else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong,
    //   errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    // }

    console.error(err);
    return throwError(err);
  }
}
