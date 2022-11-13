import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
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
  switchMapTo,
  takeWhile,
  tap,
} from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { ICreateIssueDTO, IIssue } from "../shared/interfaces/issue.interface";
import { IPagedData } from "../shared/interfaces/pagination.interface";
import { IProject } from "../shared/interfaces/project.interface";
import { ITask } from "../shared/interfaces/task.interface";
import { ITodo, IUpdateTodoDTO } from "../shared/interfaces/todo.interface";
import { IAppUser, UserRole } from "../shared/interfaces/user.interface";
import { NotificationService } from "../shared/notification.service";
import { SnackbarService } from "../shared/services/snackbar.service";
import {
  ISearchGroup,
  ISearchResult,
  mapSearchResults,
  sendTaskApproachingDeadlineNotification,
} from "../shared/utility/common";
import { handleError } from "../shared/utility/error";
import { TaskStatus } from "./../shared/interfaces/task.interface";

@Injectable({
  providedIn: "root",
})
export class EmployeeService implements OnDestroy {
  private readonly employeeUrl = environment.employeeUrl;

  private readonly refreshSubject = new BehaviorSubject<void>(null);
  readonly refresh$ = this.refreshSubject.asObservable();

  private readonly stateRefreshSubject = new BehaviorSubject<IAppUser>(null);
  readonly stateRefresh$ = this.stateRefreshSubject.asObservable();

  private readonly taskCategorySelectedSubject = new BehaviorSubject<string>(
    TaskStatus.ALL
  );
  readonly taskCategorySelectedAction$ =
    this.taskCategorySelectedSubject.asObservable();

  private readonly projectIdSubject = new ReplaySubject<number>(1);
  readonly projectId$ = this.projectIdSubject.asObservable();

  private readonly projectPageNumberSubject = new ReplaySubject<number>(1);
  readonly projectPageNumber$ = this.projectPageNumberSubject.asObservable();

  private readonly selectedProjectSubject = new Subject<IProject>();
  readonly selectedProject$ = this.selectedProjectSubject.asObservable();

  private readonly loadMoreProjectsSubject = new ReplaySubject<boolean>(1);
  readonly loadMoreProjects$ = this.loadMoreProjectsSubject.asObservable();

  projects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.EMPLOYEE)),
    switchMapTo(this.getAllProjects())
  );

  pagedProjects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.EMPLOYEE)),
    tap(() => this.setDefaultPagination()),
    switchMap(() => this.projectPageNumber$),
    concatMap((pageNumber) => this.getPagedProjects(pageNumber)),
    takeWhile((pagedData) => this.checkPagedData(pagedData)),
    pluck("data"),
    scan((acc, value) => [...acc, ...value], [] as IProject[]),
    catchError((err) =>
      handleError(err, (errorMessage) => {
        this.snackbarService.showSnackBar(errorMessage);
      })
    )
  );

  tasks$ = combineLatest(
    this.selectedProject$,
    this.authService.currentUser$
  ).pipe(
    filter(([project, currentUser]) => Boolean(project && currentUser)),
    map(([project, currentUser]) =>
      project.tasks.filter((task) => task.user.id === currentUser.id)
    ),
    tap((tasks) => {
      tasks.forEach((task) => {
        sendTaskApproachingDeadlineNotification.call(this, task);
      });
    }),
    catchError((err) =>
      handleError(err, (errorMessage) => {
        this.snackbarService.showSnackBar(errorMessage);
      })
    )
  );

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
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
      .pipe(shareReplay(1));
  }

  getPagedProjects(pageNumber: number): Observable<IPagedData<IProject>> {
    const params = new HttpParams().set("pageNumber", pageNumber.toString());
    return this.http.get<IPagedData<IProject>>(
      `${this.employeeUrl}/projects/paged`,
      {
        params,
      }
    );
  }

  getProjectById(projectId: number): Observable<IProject> {
    return this.http.get<IProject>(`${this.employeeUrl}/project/${projectId}`);
  }

  getTaskById(taskId: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.employeeUrl}/task/${taskId}`);
  }

  getAllIssues(projectId: number): Observable<IIssue[]> {
    return this.http.get<IIssue[]>(`${this.employeeUrl}/issues/${projectId}`);
  }

  createIssue(
    projectId: number,
    issueRequest: ICreateIssueDTO
  ): Observable<IIssue> {
    return this.http
      .post<IIssue>(
        `${this.employeeUrl}/create-issue/${projectId}`,
        issueRequest
      )
      .pipe(tap(() => this.refresh()));
  }

  updateTodo(updateTodoDTO: IUpdateTodoDTO, todoId: number): Observable<ITodo> {
    return this.http
      .put<ITodo>(`${this.employeeUrl}/edit-todo/${todoId}`, updateTodoDTO)
      .pipe(tap(() => this.refresh()));
  }

  completeTask(taskId: number): Observable<ITask> {
    return this.http
      .put<ITask>(`${this.employeeUrl}/complete-task/${taskId}`, {})
      .pipe(tap(() => this.refresh()));
  }

  globalSearch(searchKey: string): Observable<ISearchGroup[]> {
    return this.http
      .get<ISearchResult>(`${this.employeeUrl}/search/${searchKey}`)
      .pipe(map(mapSearchResults));
  }

  ngOnDestroy(): void {
    this.refreshSubject.complete();
    this.stateRefreshSubject.complete();
    this.taskCategorySelectedSubject.complete();
    this.projectIdSubject.complete();
    this.projectPageNumberSubject.complete();
    this.selectedProjectSubject.complete();
    this.loadMoreProjectsSubject.complete();
  }

  private checkPagedData(pagedData: IPagedData<IProject>): boolean {
    if (pagedData.totalPages === 0) {
      this.loadMoreProjects(false);
      return true;
    }
    const isNotOver = pagedData.currentPage < pagedData.totalPages;
    if (!isNotOver) {
      this.loadMoreProjects(false);
    }
    return isNotOver;
  }

  private setDefaultPagination(): void {
    this.loadMoreProjects(true);
    this.changeProjectPageNumber(1);
  }
}
