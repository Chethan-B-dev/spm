import { HttpClient, HttpParams } from "@angular/common/http";
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
  concatMap,
  filter,
  map,
  pluck,
  scan,
  shareReplay,
  switchMap,
  takeWhile,
  tap,
} from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { IIssue } from "../shared/interfaces/issue.interface";
import { IPagedData } from "../shared/interfaces/pagination.interface";
import { IProject } from "../shared/interfaces/project.interface";
import { ITask } from "../shared/interfaces/task.interface";
import { ITodo, IUpdateTodoDTO } from "../shared/interfaces/todo.interface";
import { IAppUser, UserRole } from "../shared/interfaces/user.interface";
import { NotificationService } from "../shared/notification.service";
import {
  ISearchGroup,
  ISearchResult,
  mapSearchResults,
  sendTaskApproachingDeadlineNotification,
} from "../shared/utility/common";
import { handleError } from "../shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private employeeUrl = environment.employeeUrl;

  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  private stateRefreshSubject = new BehaviorSubject<IAppUser>(null);
  stateRefresh$ = this.stateRefreshSubject.asObservable();

  private taskCategorySelectedSubject = new BehaviorSubject<string>("ALL");
  taskCategorySelectedAction$ = this.taskCategorySelectedSubject.asObservable();

  private projectIdSubject = new ReplaySubject<number>(1);
  projectId$ = this.projectIdSubject.asObservable();

  private projectPageNumberSubject = new ReplaySubject<number>(1);
  projectPageNumber$ = this.projectPageNumberSubject.asObservable();

  private selectedProjectSubject = new Subject<IProject>();
  selectedProject$ = this.selectedProjectSubject.asObservable();

  private loadMoreProjectsSubject = new ReplaySubject<boolean>(1);
  loadMoreProjects$ = this.loadMoreProjectsSubject.asObservable();

  projects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.EMPLOYEE)),
    switchMap(() => this.getAllProjects()),
    catchError(handleError)
  );

  pagedProjects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.EMPLOYEE)),
    tap(() => {
      this.loadMoreProjects(true);
      this.changeProjectPageNumber(1);
    }),
    switchMap(() => this.projectPageNumber$),
    concatMap((pageNumber) => this.getPagedProjects(pageNumber)),
    takeWhile((pagedData) => {
      const isNotOver = pagedData.currentPage < pagedData.totalPages;
      if (!isNotOver) this.loadMoreProjects(false);
      return isNotOver;
    }),
    pluck("data"),
    scan((acc, value) => [...acc, ...value], [] as IProject[]),
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
    tap((tasks) => {
      tasks.forEach((task) => {
        sendTaskApproachingDeadlineNotification.call(this, task);
      });
    }),
    catchError(handleError)
  );

  constructor(
    private http: HttpClient,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  refresh(): void {
    this.refreshSubject.next();
  }

  loadMoreProjects(value: boolean): void {
    this.loadMoreProjectsSubject.next(value);
  }

  changeProjectPageNumber(projectPageNumber: number): void {
    this.projectPageNumberSubject.next(projectPageNumber);
  }

  stateRefresh(user: IAppUser): void {
    this.stateRefreshSubject.next(user);
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

  getPagedProjects(pageNumber: number): Observable<IPagedData<IProject>> {
    const params = new HttpParams().set("pageNumber", pageNumber.toString());
    return this.http
      .get<IPagedData<IProject>>(`${this.employeeUrl}/projects/paged`, {
        params,
      })
      .pipe(catchError(handleError));
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

  globalSearch(searchKey: string): Observable<ISearchGroup[]> {
    return this.http
      .get<ISearchResult>(`${this.employeeUrl}/search/${searchKey}`)
      .pipe(
        map((searchResults) => mapSearchResults(searchResults)),
        catchError(handleError)
      );
  }
}
