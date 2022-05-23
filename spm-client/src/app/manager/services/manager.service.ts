import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap, catchError } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { handleError } from "src/app/shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class ManagerService {
  private managerUrl = "http://localhost:8080/api/manager";

  private refreshSubject = new BehaviorSubject(null);

  get refresh() {
    return this.refreshSubject.asObservable();
  }

  // todo: headers for temp testing of jwt, later replace with HTTP interceptor
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QyLmNvbSIsInJvbGUiOiJNQU5BR0VSIiwiZXhwIjoxNjU0MzU1ODYxLCJpYXQiOjE2NTMyNzU4NjF9.EGJLB4va1thGRQhrGav5l9S8LX3M8XPJTBhvhpKnEeo_qRDj_hm46ze0C3ff-1GcvOzgs3JJvT4eTRVNkUa1jQ",
  });

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<IProject[]> {
    return this.http
      .get<IProject[]>(`${this.managerUrl}/projects`, { headers: this.headers })
      .pipe(catchError(handleError));
  }

  getAllEmployees(projectId: number): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(`${this.managerUrl}/employees/${projectId}`, {
        headers: this.headers,
      })
      .pipe(catchError(handleError));
  }

  addEmployees(projectId: number, userIds: number[]): Observable<IProject> {
    const requestBody = {
      userIds,
    };
    return this.http
      .put<IProject>(
        `${this.managerUrl}/assign-user/${projectId}`,
        requestBody,
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap(() => this.refreshSubject.next(null)),
        catchError(handleError)
      );
  }

  getProjectById(projectId: number): Observable<IProject> {
    return this.http
      .get<IProject>(`${this.managerUrl}/project/${projectId}`, {
        headers: this.headers,
      })
      .pipe(tap(console.log), catchError(handleError));
  }

  createProject(
    projectName: string,
    projectDescription: string,
    projectDeadLine: Date
  ): Observable<IProject> {
    const requestBody = {
      projectName,
      description: projectDescription,
      toDate: projectDeadLine.toISOString(),
    };
    return this.http
      .post<IProject>(`${this.managerUrl}/create-project`, requestBody, {
        headers: this.headers,
      })
      .pipe(
        tap(() => this.refreshSubject.next(null)),
        catchError(handleError)
      );
  }
}
