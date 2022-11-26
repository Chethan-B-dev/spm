import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IAppUser, UserStatus } from "../shared/interfaces/user.interface";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  readonly defaultUserCategory = UserStatus.UNVERIFIED;
  private readonly adminUrl = environment.adminUrl;

  private readonly userCategorySelectedSubject = new BehaviorSubject<string>(
    this.defaultUserCategory
  );
  readonly userCategorySelectedAction$ =
    this.userCategorySelectedSubject.asObservable();

  private readonly searchTermSubject = new BehaviorSubject<string>("");
  readonly searchTerm$ = this.searchTermSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getSearchTerm(): string {
    return this.searchTermSubject.getValue();
  }

  getUserCategory(): string {
    return this.userCategorySelectedSubject.getValue();
  }

  searchUser(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm.trim().toLowerCase());
  }

  onUserCategoryChange(selectedUserCategory: string): void {
    this.userCategorySelectedSubject.next(selectedUserCategory);
  }

  getAllUsers(): Observable<IAppUser[]> {
    return this.http.get<IAppUser[]>(this.adminUrl);
  }

  takeDecision(userId: number, adminDecision: string): Observable<IAppUser> {
    const requestBody = { userId, adminDecision };
    return this.http.post<IAppUser>(
      `${this.adminUrl}/take-decision`,
      requestBody
    );
  }

  enableUser(userId: number): Observable<IAppUser> {
    return this.http.get<IAppUser>(`${this.adminUrl}/enable/${userId}`);
  }
}
