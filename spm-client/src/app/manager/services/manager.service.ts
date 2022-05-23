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
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QyLmNvbSIsInJvbGUiOiJNQU5BR0VSIiwiZXhwIjoxNjUzMjMwNTM2LCJpYXQiOjE2NTMyMTI1MzZ9.sVmc4lr9Hjnw6w3xMI7qYUiIQsv2D6AvWRwy90mmC7tfolP-8opEMXxGrD7QnVoV2CNzw-7xJ8x8CqkJlN479g",
  });

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<IProject[]> {
    return this.http
      .get<IProject[]>(`${this.managerUrl}/projects`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getAllEmployees(projectId: number): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(`${this.managerUrl}/employees/${projectId}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
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
        catchError(this.handleError)
      );
  }

  getProjectById(projectId: number): Observable<IProject> {
    return this.http
      .get<IProject>(`${this.managerUrl}/project/${projectId}`, {
        headers: this.headers,
      })
      .pipe(tap(console.log), catchError(this.handleError));
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
