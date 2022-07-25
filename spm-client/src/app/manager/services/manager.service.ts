// angular
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
// rxjs
import {
  BehaviorSubject,
  combineLatest,
  merge,
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
  startWith,
  switchMap,
  takeWhile,
  tap,
} from "rxjs/operators";
import {
  IIssue,
  IUpdateIssueDTO,
} from "src/app/shared/interfaces/issue.interface";
import { IPagedData } from "src/app/shared/interfaces/pagination.interface";
// interfaces
import { IProject, ProjectStatus } from "src/app/shared/interfaces/project.interface";
import {
  ITask,
  ITaskRequestDTO,
} from "src/app/shared/interfaces/task.interface";
import { ITodo } from "src/app/shared/interfaces/todo.interface";
import { IAppUser, UserRole } from "src/app/shared/interfaces/user.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SharedService } from "src/app/shared/shared.service";
import {
  ISearchGroup,
  ISearchResult,
  mapSearchResults,
  sendProjectApproachingDeadlineNotification,
} from "src/app/shared/utility/common";
// utility
import { handleError } from "src/app/shared/utility/error";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ManagerService {
  private managerUrl = environment.managerUrl;

  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  private stateRefreshSubject = new BehaviorSubject<IAppUser>(null);
  stateRefresh$ = this.stateRefreshSubject.asObservable();

  private projectInsertedSubject = new Subject<IProject>();
  projectInsertedAction$ = this.projectInsertedSubject.asObservable();

  private taskInsertedSubject = new Subject<ITask>();
  taskInsertedAction$ = this.taskInsertedSubject.asObservable();

  private userPageNumberSubject = new ReplaySubject<number>(1);
  userPageNumber$ = this.userPageNumberSubject.asObservable();

  private projectPageNumberSubject = new ReplaySubject<number>(1);
  projectPageNumber$ = this.projectPageNumberSubject.asObservable();

  private projectIdSubject = new ReplaySubject<number>(1);
  projectId$ = this.projectIdSubject.asObservable();

  private taskCategorySelectedSubject = new BehaviorSubject<string>("ALL");
  taskCategorySelectedAction$ = this.taskCategorySelectedSubject.asObservable();

  private selectedProjectSubject = new Subject<IProject>();
  selectedProject$ = this.selectedProjectSubject.asObservable();

  private loadMoreUsersSubject = new ReplaySubject<boolean>(1);
  loadMoreUsers$ = this.loadMoreUsersSubject.asObservable();

  private loadMoreProjectsSubject = new ReplaySubject<boolean>(1);
  loadMoreProjects$ = this.loadMoreProjectsSubject.asObservable();

  projects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.MANAGER)),
    switchMap(() => this.getAllProjects()),
    catchError(handleError)
  );

  pagedProjects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.MANAGER)),
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
    tap((projects) => {
      projects.forEach((project) => {
        sendProjectApproachingDeadlineNotification.call(this, project);
      });
    }),
    scan((acc, value) => [...acc, ...value], [] as IProject[]),
    catchError(handleError)
  );

  users$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.MANAGER)),
    tap(() => {
      this.loadMoreUsers(true);
      this.changeUserPageNumber(1);
    }),
    switchMap(() => this.userPageNumber$),
    concatMap((pageNumber) => this.getMoreUsers(pageNumber)),
    takeWhile((pagedData) => {
      const isNotOver = pagedData.currentPage < pagedData.totalPages;
      if (!isNotOver) this.loadMoreUsers(false);
      return isNotOver;
    }),
    pluck("data"),
    scan((acc, value) => [...acc, ...value], [] as IAppUser[]),
    catchError(handleError)
  );

  projectsWithAdd$: Observable<IProject[]> = this.stateRefresh$.pipe(
    switchMap(() => merge(this.pagedProjects$, this.projectInsertedAction$)),
    scan(
      (acc: IProject[], value: IProject) =>
        value instanceof Array ? [...value] : [value, ...acc],
      [] as IProject[]
    ),
    shareReplay(1),
    catchError(handleError)
  );

  // todo: this is not used anywhere, keeping it as reference to use in the future
  selectedSingleProject$ = combineLatest(
    this.projectsWithAdd$,
    this.projectId$
  ).pipe(
    map(([projects, projectId]) =>
      projects.find((project) => project.id === projectId)
    ),
    catchError(handleError)
  );

  tasks$ = this.selectedProject$.pipe(
    switchMap((project) => of(project.tasks)),
    catchError(handleError)
  );

  tasksWithAdd$ = merge(this.tasks$, this.taskInsertedAction$).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [value, ...acc]),
      [] as ITask[]
    ),
    shareReplay(1),
    catchError(handleError)
  );

  constructor(
    private http: HttpClient,
    private readonly sharedService: SharedService,
    private readonly notificationService: NotificationService
  ) {}

  refresh(): void {
    this.refreshSubject.next();
  }

  stateRefresh(user: IAppUser): void {
    this.stateRefreshSubject.next(user);
  }

  loadMoreUsers(value: boolean): void {
    this.loadMoreUsersSubject.next(value);
  }

  loadMoreProjects(value: boolean): void {
    this.loadMoreProjectsSubject.next(value);
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

  getPagedProjects(pageNumber: number): Observable<IPagedData<IProject>> {
    const params = new HttpParams().set("pageNumber", pageNumber.toString());
    return this.http
      .get<IPagedData<IProject>>(`${this.managerUrl}/projects/paged`, {
        params,
      })
      .pipe(catchError(handleError));
  }

  getAllTasks(projectId: number): Observable<ITask[]> {
    return this.http
      .get<ITask[]>(`${this.managerUrl}/tasks/${projectId}`)
      .pipe(catchError(handleError));
  }

  getTaskById(taskId: number): Observable<ITask> {
    return this.http
      .get<ITask>(`${this.managerUrl}/task/${taskId}`)
      .pipe(catchError(handleError));
  }

  getAllIssues(projectId: number): Observable<IIssue[]> {
    return this.http
      .get<IIssue[]>(`${this.managerUrl}/issues/${projectId}`)
      .pipe(catchError(handleError));
  }

  getMoreUsers(pageNumber: number): Observable<IPagedData<IAppUser>> {
    const params = new HttpParams().set("pageNumber", pageNumber.toString());
    return this.http
      .get<IPagedData<IAppUser>>(`${this.managerUrl}/employees`, {
        params,
      })
      .pipe(catchError(handleError));
  }

  changeUserPageNumber(userPageNumber: number): void {
    this.userPageNumberSubject.next(userPageNumber);
  }

  changeProjectPageNumber(projectPageNumber: number): void {
    this.projectPageNumberSubject.next(projectPageNumber);
  }

  getAllProjects(): Observable<IProject[]> {
    return this.http
      .get<IProject[]>(`${this.managerUrl}/projects`)
      .pipe(shareReplay(1), catchError(handleError));
  }

  getAllEmployees(projectId: number): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(`${this.managerUrl}/employees/${projectId}`)
      .pipe(catchError(handleError));
  }

  getEmployeesUnderProject(projectId: number): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(`${this.managerUrl}/project/${projectId}/employees`)
      .pipe(catchError(handleError));
  }

  addEmployees(projectId: number, employees: IAppUser[]): Observable<IProject> {
    const userIds = employees.map((employee) => employee.id);
    return this.http
      .put<IProject>(`${this.managerUrl}/assign-user/${projectId}`, {
        userIds,
      })
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }

  setEmployeeDesignation(employee: IAppUser): Observable<IAppUser> {
    return this.http
      .put<IAppUser>(`${this.managerUrl}/edit-designation/${employee.id}`, {
        designation: employee.designation,
      })
      .pipe(catchError(handleError));
  }

  getProjectById(projectId: number): Observable<IProject> {
    return this.http
      .get<IProject>(`${this.managerUrl}/project/${projectId}`)
      .pipe(catchError(handleError));
  }

  createProject(
    projectName: string,
    projectDescription: string,
    projectDeadLine: Date
  ): Observable<IProject> {
    const requestBody = {
      projectName,
      description: projectDescription,
      toDate: new Date(projectDeadLine + "Z").toISOString().substring(0, 10),
    };
    return this.http
      .post<IProject>(`${this.managerUrl}/create-project`, requestBody)
      .pipe(
        tap((project) => this.addProject(project)),
        catchError(handleError)
      );
  }

  editProject(
    projectId: number,
    projectName: string,
    projectDescription: string,
    projectDeadLine: Date,
    status: ProjectStatus
  ): Observable<IProject> {
    const requestBody = {
      projectName,
      description: projectDescription,
      toDate: new Date(projectDeadLine + "Z").toISOString().substring(0, 10),
      status
    };
    return this.http
      .put<IProject>(
        `${this.managerUrl}/edit-project/${projectId}`,
        requestBody
      )
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }

  createTask(
    taskRequestDTO: ITaskRequestDTO,
    projectId: number
  ): Observable<ITask> {
    return this.http
      .post<ITask>(`${this.managerUrl}/${projectId}/create-task`, {
        ...taskRequestDTO,
        deadLine: new Date(taskRequestDTO.deadLine + "Z")
          .toISOString()
          .substring(0, 10),
      })
      .pipe(
        tap((task) => {
          this.addTask(task);
          this.refresh();
        }),
        catchError(handleError)
      );
  }

  createTodo(todo: { todo: string }, taskId: number): Observable<ITodo> {
    return this.http
      .post<ITodo>(`${this.managerUrl}/${taskId}/create-todo`, {
        todoName: todo.todo,
      })
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
      .put<IIssue>(`${this.managerUrl}/edit-issue/${issueId}`, updateIssueDTO)
      .pipe(
        tap(() => this.sharedService.refresh()),
        catchError(handleError)
      );
  }

  deleteTask(taskId: number): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.managerUrl}/delete-task/${taskId}`)
      .pipe(catchError(handleError));
  }

  deleteTodo(todoId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.managerUrl}/delete-todo/${todoId}`)
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }

  globalSearch(searchKey: string): Observable<ISearchGroup[]> {
    return this.http
      .get<ISearchResult>(`${this.managerUrl}/search/${searchKey}`)
      .pipe(
        map((searchResults) => mapSearchResults(searchResults)),
        catchError(handleError)
      );
  }

  private addProject(newProject: IProject): void {
    this.projectInsertedSubject.next(newProject);
  }

  private addTask(newTask: ITask): void {
    this.taskInsertedSubject.next(newTask);
  }
}
