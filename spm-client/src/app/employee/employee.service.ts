import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from "rxjs";
import { catchError, shareReplay, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IIssue } from "../shared/interfaces/issue.interface";
import { IProject } from "../shared/interfaces/project.interface";
import { ITask } from "../shared/interfaces/task.interface";
import { handleError } from "../shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private employeeUrl = environment.employeeUrl;

  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  private taskCategorySelectedSubject = new BehaviorSubject<string>("ALL");
  taskCategorySelectedAction$ = this.taskCategorySelectedSubject.asObservable();

  private projectIdSubject = new ReplaySubject<number>(1);
  projectId$ = this.projectIdSubject.asObservable();

  private selectedProjectSubject = new Subject<IProject>();
  selectedProject$ = this.selectedProjectSubject.asObservable();

  projects$ = this.http
    .get<IProject[]>(`${this.employeeUrl}/projects`)
    .pipe(shareReplay(1), catchError(handleError));

  tasks$ = this.selectedProject$.pipe(
    switchMap((project) => of(project.tasks)),
    catchError(handleError)
  );

  constructor(private http: HttpClient) {}

  refresh(): void {
    this.refreshSubject.next();
  }

  selectTaskCategory(selectedTaskCategory: string): void {
    this.taskCategorySelectedSubject.next(selectedTaskCategory);
  }

  setProjectId(projectId: number): void {
    this.projectIdSubject.next(projectId);
  }

  setProject(project: IProject): void {
    this.selectedProjectSubject.next(project);
  }

  getProjectById(projectId: number): Observable<IProject> {
    return this.http
      .get<IProject>(`${this.employeeUrl}/project/${projectId}`)
      .pipe(catchError(handleError));
  }

  getTaskById(taskId: number): Observable<ITask> {
    return this.http
      .get<ITask>(`${this.employeeUrl}/task/${taskId}`)
      .pipe(catchError(handleError));
  }

  getAllIssues(projectId: number): Observable<IIssue[]> {
    return this.http
      .get<IIssue[]>(`${this.employeeUrl}/issues/${projectId}`)
      .pipe(catchError(handleError));
  }

  createIssue(
    projectId: number,
    issueRequest: { summary: string }
  ): Observable<IIssue> {
    return this.http
      .post<IIssue>(
        `${this.employeeUrl}/create-issue/${projectId}`,
        issueRequest
      )
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }
}
