import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import {
  IComment,
  IIssue,
  IUpdateIssueDTO,
} from "./interfaces/issue.interface";
import { handleError } from "./utility/error";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private readonly sharedUrl = environment.sharedUrl;
  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  refresh(): void {
    this.refreshSubject.next();
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

  updateIssue(
    updateIssueDTO: IUpdateIssueDTO,
    issueId: number
  ): Observable<IIssue> {
    return this.http
      .put<IIssue>(`${this.sharedUrl}/edit-issue/${issueId}`, updateIssueDTO)
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }
}
