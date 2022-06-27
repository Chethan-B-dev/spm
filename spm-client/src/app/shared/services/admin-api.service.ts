import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, shareReplay, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IAppUser } from "../interfaces/user.interface";
import { handleError } from "../utility/error";

@Injectable({
  providedIn: "root",
})
export class AdminApiService {
  private adminUrl = environment.adminUrl;
  private userCategorySelectedSubject = new BehaviorSubject<string>(
    "UNVERIFIED"
  );
  userCategorySelectedAction$ = this.userCategorySelectedSubject.asObservable();
  static readonly adminId = 33;

  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IAppUser[]> {
    return this.refresh$.pipe(
      switchMap(() => this.http.get<IAppUser[]>(this.adminUrl)),
      shareReplay(1),
      catchError(handleError)
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
      .post<IAppUser>(`${this.adminUrl}/take-decision`, requestBody)
      .pipe(catchError(handleError));
  }

  enableUser(userId: number): Observable<IAppUser> {
    return this.http
      .get<IAppUser>(`${this.adminUrl}/enable/${userId}`)
      .pipe(catchError(handleError));
  }
}
