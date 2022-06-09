import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, shareReplay, switchMap, tap } from "rxjs/operators";
import { IAppUser } from "../interfaces/user.interface";
import { handleError } from "../utility/error";

@Injectable({
  providedIn: "root",
})
export class AdminApiService {
  private usersUrl = "http://localhost:8080/api/admin";
  private userCategorySelectedSubject = new BehaviorSubject<string>(
    "UNVERIFIED"
  );
  userCategorySelectedAction$ = this.userCategorySelectedSubject.asObservable();

  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$: Observable<void> = this.refreshSubject.asObservable();

  // todo: headers for temp testing of jwt, later replace with HTTP interceptor
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTY1NTUyODM2MiwiaWF0IjoxNjU0NDQ4MzYyfQ.IeybbRfOp8dXMiZnaXlmYWNAvxSL10syFmTtC_FR-ujYAxzOpJzTd1IZdl2yHgTfKQlMUq9RiaQyX0a7bX1l9A",
  });

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IAppUser[]> {
    return this.refresh$.pipe(
      switchMap(() =>
        this.http
          .get<IAppUser[]>(this.usersUrl, { headers: this.headers })
          .pipe(catchError(handleError))
      ),
      shareReplay(1)
    );
  }

  refresh(): void {
    this.refreshSubject.next();
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
      .pipe(catchError(handleError));
  }

  enableUser(userId: number): Observable<IAppUser> {
    return this.http
      .get<IAppUser>(`${this.usersUrl}/enable/${userId}`, {
        headers: this.headers,
      })
      .pipe(catchError(handleError));
  }
}
