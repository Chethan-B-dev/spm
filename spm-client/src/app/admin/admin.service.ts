import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IAppUser } from "../shared/interfaces/user.interface";
import { handleError } from "../shared/utility/error";
import {
  IUserAction,
  UserStatus,
  userStatusActions,
} from "./../shared/interfaces/user.interface";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private readonly adminUrl = environment.adminUrl;
  private readonly userCategorySelectedSubject = new BehaviorSubject<string>(
    UserStatus.UNVERIFIED
  );
  readonly userCategorySelectedAction$ =
    this.userCategorySelectedSubject.asObservable();

  private readonly defaultUserStatus = {
    userId: -1,
    status: UserStatus.ALL,
  };

  private readonly userStatusSubject = new BehaviorSubject<IUserAction>(
    this.defaultUserStatus
  );
  readonly userStatusAction$ = this.userStatusSubject.asObservable();

  users$ = this.http
    .get<IAppUser[]>(this.adminUrl)
    .pipe(catchError(handleError));

  usersWithAction$ = combineLatest(this.users$, this.userStatusAction$).pipe(
    map(([users, userAction]) => {
      if (userAction.userId === -1 || userAction.status === UserStatus.ALL) {
        return users;
      }
      return users.map((user) => {
        if (userAction.userId === user.id) {
          return { ...user, status: userAction.status };
        }
        return user;
      });
    }),
    catchError(handleError)
  );

  constructor(private readonly http: HttpClient) {}

  selectUserCategory(selectedUserCategory: string): void {
    this.userCategorySelectedSubject.next(selectedUserCategory);
  }

  takeDecision(userId: number, adminDecision: string): Observable<IAppUser> {
    const requestBody = { userId, adminDecision };
    return this.http
      .post<IAppUser>(`${this.adminUrl}/take-decision`, requestBody)
      .pipe(
        tap(() => this.setUserStatus(userId, userStatusActions[adminDecision])),
        catchError(handleError)
      );
  }

  enableUser(userId: number): Observable<IAppUser> {
    return this.http.get<IAppUser>(`${this.adminUrl}/enable/${userId}`).pipe(
      tap(() => this.setUserStatus(userId, UserStatus.UNVERIFIED)),
      catchError(handleError)
    );
  }

  private setUserStatus(userId: number, status: UserStatus): void {
    this.userStatusSubject.next({
      userId,
      status,
    });
  }
}
