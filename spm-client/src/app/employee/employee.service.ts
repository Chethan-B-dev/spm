import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subject,
} from "rxjs";
import {
  catchError,
  filter,
  shareReplay,
  switchMap,
  tap,
} from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { IIssue } from "../shared/interfaces/issue.interface";
import { IProject } from "../shared/interfaces/project.interface";
import { ITask } from "../shared/interfaces/task.interface";
import { ITodo, IUpdateTodoDTO } from "../shared/interfaces/todo.interface";
import { handleError } from "../shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private employeeUrl = environment.employeeUrl;

  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  private stateRefreshSubject = new BehaviorSubject<void>(null);
  stateRefresh$ = this.stateRefreshSubject.asObservable();

  private taskCategorySelectedSubject = new BehaviorSubject<string>("ALL");
  taskCategorySelectedAction$ = this.taskCategorySelectedSubject.asObservable();

  private projectIdSubject = new ReplaySubject<number>(1);
  projectId$ = this.projectIdSubject.asObservable();

  private selectedProjectSubject = new Subject<IProject>();
  selectedProject$ = this.selectedProjectSubject.asObservable();

  projects$ = this.stateRefresh$.pipe(
    switchMap(() => this.getAllProjects()),
    catchError(handleError)
  );

  tasks$ = combineLatest(
    this.selectedProject$,
    this.authService.currentUser$
  ).pipe(
    filter(([project, currentUser]) => Boolean(project && currentUser)),
    switchMap(([project, currentUser]) => {
      const myTasks = project.tasks.filter(
        (task) => task.user.id === currentUser.id
      );
      return of(myTasks);
    }),
    catchError(handleError)
  );

  constructor(private http: HttpClient, private authService: AuthService) {}

  refresh(): void {
    this.refreshSubject.next();
  }

  stateRefresh(): void {
    this.stateRefreshSubject.next();
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

  getAllProjects(): Observable<IProject[]> {
    return this.http
      .get<IProject[]>(`${this.employeeUrl}/projects`)
      .pipe(shareReplay(1), catchError(handleError));
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

  updateTodo(updateTodoDTO: IUpdateTodoDTO, todoId: number): Observable<ITodo> {
    return this.http
      .put<ITodo>(`${this.employeeUrl}/edit-todo/${todoId}`, updateTodoDTO)
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }

  completeTask(taskId: number): Observable<ITask> {
    return this.http
      .put<ITask>(`${this.employeeUrl}/complete-task/${taskId}`, {})
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }
}
