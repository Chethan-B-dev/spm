import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IComment, IIssue } from "./interfaces/issue.interface";
import { IProject } from "./interfaces/project.interface";
import { IAppUser } from "./interfaces/user.interface";
import { handleError } from "./utility/error";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private readonly sharedUrl = environment.sharedUrl;
  private readonly refreshSubject = new BehaviorSubject<void>(null);
  readonly refresh$ = this.refreshSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  refresh(): void {
    this.refreshSubject.next();
  }

  // todo: check if this is working
  getAdmin(): Observable<IAppUser> {
    return this.http
      .get<IAppUser>(`${this.sharedUrl}/get-admin`)
      .pipe(catchError(handleError));
  }

  getAllEmployeeProjects(employeeId: number): Observable<IProject[]> {
    return this.http
      .get<IProject[]>(`${this.sharedUrl}/employee-projects/${employeeId}`)
      .pipe(catchError(handleError));
  }

  getIssueById(issueId: number): Observable<IIssue> {
    return this.http
      .get<IIssue>(`${this.sharedUrl}/issue/${issueId}`)
      .pipe(catchError(handleError));
  }

  addComment(
    comment: string,
    userId: number,
    issueId: number
  ): Observable<IComment> {
    return this.http
      .post<IComment>(`${this.sharedUrl}/comment/${issueId}`, {
        comment,
        userId,
      })
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }

  getAllComments(issueId: number): Observable<IComment[]> {
    return this.http
      .get<IComment[]>(`${this.sharedUrl}/comment/${issueId}`)
      .pipe(catchError(handleError));
  }

  deleteComment(commentId: number): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.sharedUrl}/delete-comment/${commentId}`)
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }

  getManagerOfTask(taskId: number): Observable<IAppUser> {
    return this.http
      .get<IAppUser>(`${this.sharedUrl}/task/manager/${taskId}`)
      .pipe(catchError(handleError));
  }
}
