import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import {
  BehaviorSubject,
  merge,
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
import {
  IIssue,
  IUpdateIssueDTO,
} from "src/app/shared/interfaces/issue.interface";
import { IPagedData } from "src/app/shared/interfaces/pagination.interface";
import {
  IProject,
  ProjectStatus,
} from "src/app/shared/interfaces/project.interface";
import {
  ITask,
  ITaskRequestDTO,
} from "src/app/shared/interfaces/task.interface";
import { ITodo } from "src/app/shared/interfaces/todo.interface";
import { IAppUser, UserRole } from "src/app/shared/interfaces/user.interface";
import { NotificationService } from "src/app/shared/notification.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { SharedService } from "src/app/shared/shared.service";
import {
  ISearchGroup,
  ISearchResult,
  mapSearchResults,
  sendProjectApproachingDeadlineNotification,
} from "src/app/shared/utility/common";
import { handleError } from "src/app/shared/utility/error";
import { environment } from "src/environments/environment";
import { TaskStatus } from "./../../shared/interfaces/task.interface";
import {
  DataType,
  ICrudAction,
  ICrudOperation,
} from "./../../shared/utility/common";

@Injectable({
  providedIn: "root",
})
export class ManagerService implements OnDestroy {
  private readonly managerUrl = environment.managerUrl;

  private readonly refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  private readonly stateRefreshSubject = new BehaviorSubject<IAppUser>(null);
  readonly stateRefresh$ = this.stateRefreshSubject.asObservable();

  private readonly projectSubject = new Subject<ICrudAction<IProject>>();
  readonly projectAction$ = this.projectSubject.asObservable();

  private readonly taskInsertedSubject = new Subject<ITask>();
  readonly taskInsertedAction$ = this.taskInsertedSubject.asObservable();

  private readonly userPageNumberSubject = new ReplaySubject<number>(1);
  readonly userPageNumber$ = this.userPageNumberSubject.asObservable();

  private readonly projectPageNumberSubject = new ReplaySubject<number>(1);
  readonly projectPageNumber$ = this.projectPageNumberSubject.asObservable();

  private readonly projectIdSubject = new ReplaySubject<number>(1);
  readonly projectId$ = this.projectIdSubject.asObservable();

  private readonly taskCategorySelectedSubject = new BehaviorSubject<string>(
    TaskStatus.ALL
  );
  readonly taskCategorySelectedAction$ =
    this.taskCategorySelectedSubject.asObservable();

  private readonly selectedProjectSubject = new Subject<IProject>();
  readonly selectedProject$ = this.selectedProjectSubject.asObservable();

  private readonly loadMoreUsersSubject = new ReplaySubject<boolean>(1);
  readonly loadMoreUsers$ = this.loadMoreUsersSubject.asObservable();

  private readonly loadMoreProjectsSubject = new ReplaySubject<boolean>(1);
  readonly loadMoreProjects$ = this.loadMoreProjectsSubject.asObservable();

  projects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.MANAGER)),
    switchMapTo(this.getAllProjects())
  );

  pagedProjects$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.MANAGER)),
    tap(() => this.setDefaultPagination(DataType.PROJECT)),
    switchMap(() => this.projectPageNumber$),
    concatMap((pageNumber) => this.getPagedProjects(pageNumber)),
    takeWhile((pagedData) => this.checkPagedData(pagedData, DataType.PROJECT)),
    pluck("data"),
    tap((projects) => {
      projects.forEach((project) => {
        sendProjectApproachingDeadlineNotification.call(this, project);
      });
    }),
    scan((acc, value) => [...acc, ...value], [] as IProject[]),
    catchError((err) =>
      handleError(err, (errorMessage) => {
        this.snackbarService.showSnackBar(errorMessage);
      })
    )
  );

  users$ = this.stateRefresh$.pipe(
    filter((user) => Boolean(user && user.role === UserRole.MANAGER)),
    tap(() => this.setDefaultPagination(DataType.USER)),
    switchMap(() => this.userPageNumber$),
    concatMap((pageNumber) => this.getMoreUsers(pageNumber)),
    takeWhile((pagedData) => this.checkPagedData(pagedData, DataType.USER)),
    pluck("data"),
    scan((acc, value) => [...acc, ...value], [] as IAppUser[]),
    catchError((err) =>
      handleError(err, (errorMessage) => {
        this.snackbarService.showSnackBar(errorMessage);
      })
    )
  );

  projectsWithAdd$: Observable<IProject[]> = this.stateRefresh$.pipe(
    switchMap(() => merge(this.pagedProjects$, this.projectAction$)),
    scan((acc, value) => this.modifyProjects(acc, value), [] as IProject[]),
    catchError((err) =>
      handleError(err, (errorMessage) => {
        this.snackbarService.showSnackBar(errorMessage);
      })
    ),
    shareReplay(1)
  );

  tasks$ = this.selectedProject$.pipe(
    pluck("tasks"),
    catchError((err) =>
      handleError(err, (errorMessage) => {
        this.snackbarService.showSnackBar(errorMessage);
      })
    )
  );

  tasksWithAdd$ = merge(this.tasks$, this.taskInsertedAction$).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [value, ...acc]),
      [] as ITask[]
    ),
    catchError((err) =>
      handleError(err, (errorMessage) => {
        this.snackbarService.showSnackBar(errorMessage);
      })
    ),
    shareReplay(1)
  );

  constructor(
    private readonly http: HttpClient,
    private readonly sharedService: SharedService,
    private readonly snackbarService: SnackbarService,
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
    return this.http.get<IPagedData<IProject>>(
      `${this.managerUrl}/projects/paged`,
      {
        params,
      }
    );
  }

  getAllTasks(projectId: number): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.managerUrl}/tasks/${projectId}`);
  }

  getTaskById(taskId: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.managerUrl}/task/${taskId}`);
  }

  getAllIssues(projectId: number): Observable<IIssue[]> {
    return this.http.get<IIssue[]>(`${this.managerUrl}/issues/${projectId}`);
  }

  getMoreUsers(pageNumber: number): Observable<IPagedData<IAppUser>> {
    const params = new HttpParams().set("pageNumber", pageNumber.toString());
    return this.http.get<IPagedData<IAppUser>>(`${this.managerUrl}/employees`, {
      params,
    });
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
      .pipe(shareReplay(1));
  }

  getAllProjectsById(managerId: number): Observable<IProject[]> {
    return this.http.get<IProject[]>(
      `${this.managerUrl}/projects/${managerId}`
    );
  }

  getAllEmployees(projectId: number): Observable<IAppUser[]> {
    return this.http.get<IAppUser[]>(
      `${this.managerUrl}/employees/${projectId}`
    );
  }

  getEmployeesUnderProject(projectId: number): Observable<IAppUser[]> {
    return this.http.get<IAppUser[]>(
      `${this.managerUrl}/project/${projectId}/employees`
    );
  }

  addEmployees(projectId: number, employees: IAppUser[]): Observable<IProject> {
    const userIds = employees.map((employee) => employee.id);
    return this.http
      .put<IProject>(`${this.managerUrl}/assign-user/${projectId}`, {
        userIds,
      })
      .pipe(tap(() => this.refresh()));
  }

  setEmployeeDesignation(employee: IAppUser): Observable<IAppUser> {
    return this.http.put<IAppUser>(
      `${this.managerUrl}/edit-designation/${employee.id}`,
      {
        designation: employee.designation,
      }
    );
  }

  getProjectById(projectId: number): Observable<IProject> {
    return this.http.get<IProject>(`${this.managerUrl}/project/${projectId}`);
  }

  createProject(
    name: string,
    description: string,
    projectDeadLine: Date
  ): Observable<IProject> {
    const requestBody = {
      name,
      description,
      toDate: new Date(projectDeadLine + "Z").toISOString().substring(0, 10),
    };
    return this.http
      .post<IProject>(`${this.managerUrl}/create-project1`, requestBody)
      .pipe(tap((project) => this.addProjectAction(project)));
  }

  editProject(
    projectId: number,
    name: string,
    description: string,
    projectDeadLine: Date,
    status: ProjectStatus,
    files?: string
  ): Observable<IProject> {
    const requestBody = {
      name,
      description,
      toDate: new Date(projectDeadLine + "Z").toISOString().substring(0, 10),
      status,
      files: files || null,
    };
    return this.http
      .put<IProject>(
        `${this.managerUrl}/edit-project/${projectId}`,
        requestBody
      )
      .pipe(
        tap((project) => {
          this.editProjectAction(project);
          this.refresh();
        })
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
        })
      );
  }

  createTodo(todo: { todo: string }, taskId: number): Observable<ITodo> {
    return this.http
      .post<ITodo>(`${this.managerUrl}/${taskId}/create-todo`, {
        todoName: todo.todo,
      })
      .pipe(tap(() => this.refresh()));
  }

  updateIssue(
    updateIssueDTO: IUpdateIssueDTO,
    issueId: number
  ): Observable<IIssue> {
    return this.http
      .put<IIssue>(`${this.managerUrl}/edit-issue/${issueId}`, updateIssueDTO)
      .pipe(tap(() => this.sharedService.refresh()));
  }

  deleteTask(taskId: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.managerUrl}/delete-task/${taskId}`
    );
  }

  deleteTodo(todoId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.managerUrl}/delete-todo/${todoId}`)
      .pipe(tap(() => this.refresh()));
  }

  globalSearch(searchKey: string): Observable<ISearchGroup[]> {
    return this.http
      .get<ISearchResult>(`${this.managerUrl}/search/${searchKey}`)
      .pipe(map(mapSearchResults));
  }

  ngOnDestroy(): void {
    this.refreshSubject.complete();
    this.stateRefreshSubject.complete();
    this.taskCategorySelectedSubject.complete();
    this.projectIdSubject.complete();
    this.projectPageNumberSubject.complete();
    this.userPageNumberSubject.complete();
    this.selectedProjectSubject.complete();
    this.loadMoreProjectsSubject.complete();
    this.loadMoreUsersSubject.complete();
    this.projectSubject.complete();
    this.taskInsertedSubject.complete();
  }

  private modifyProjects(
    projects: IProject[],
    projectAction: ICrudAction<IProject> | IProject[]
  ) {
    if (projectAction instanceof Array) {
      return [...projectAction];
    }
    if (projectAction.action === ICrudOperation.ADD) {
      return [projectAction.data, ...projects];
    } else if (projectAction.action === ICrudOperation.UPDATE) {
      return projects.map((project) =>
        project.id === projectAction.data.id ? projectAction.data : project
      );
    }
    return [...projects];
  }

  private addProjectAction(newProject: IProject): void {
    this.projectSubject.next({
      data: newProject,
      action: ICrudOperation.ADD,
    });
  }

  private editProjectAction(editedProject: IProject): void {
    this.projectSubject.next({
      data: editedProject,
      action: ICrudOperation.UPDATE,
    });
  }

  private addTask(newTask: ITask): void {
    this.taskInsertedSubject.next(newTask);
  }

  private checkPagedData(
    pagedData: IPagedData<IAppUser | IProject>,
    dataType: DataType.USER | DataType.PROJECT
  ): boolean {
    if (pagedData.totalPages === 0) {
      if (dataType === DataType.USER) {
        this.loadMoreUsers(false);
      } else {
        this.loadMoreProjects(false);
      }
      return true;
    }

    const isNotOver = pagedData.currentPage < pagedData.totalPages;

    if (!isNotOver || pagedData.currentPage + 1 === pagedData.totalPages) {
      if (dataType === DataType.USER) {
        this.loadMoreUsers(false);
      } else {
        this.loadMoreProjects(false);
      }
    }
    return isNotOver;
  }

  private setDefaultPagination(
    dataType: DataType.USER | DataType.PROJECT
  ): void {
    if (dataType === DataType.USER) {
      this.loadMoreUsers(true);
      this.changeUserPageNumber(1);
    } else {
      this.loadMoreProjects(true);
      this.changeProjectPageNumber(1);
    }
  }
}
