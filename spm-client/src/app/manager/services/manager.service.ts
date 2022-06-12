// angular
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
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
  map,
  scan,
  shareReplay,
  switchMap,
  tap,
} from "rxjs/operators";
import { IIssue } from "src/app/shared/interfaces/issue.interface";
import { IPagedData } from "src/app/shared/interfaces/pagination.interface";
// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  ITask,
  ITaskRequestDTO,
  TaskStatus,
} from "src/app/shared/interfaces/task.interface";
import { ITodo } from "src/app/shared/interfaces/todo.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
// utility
import { handleError } from "src/app/shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class ManagerService {
  //todo: get this url from env variable
  private managerUrl: string = "http://localhost:8080/api/manager";

  private refreshSubject = new BehaviorSubject<void>(null);
  refresh$ = this.refreshSubject.asObservable();

  private projectInsertedSubject = new Subject<IProject>();
  projectInsertedAction$ = this.projectInsertedSubject.asObservable();

  private taskInsertedSubject = new Subject<ITask>();
  taskInsertedAction$ = this.taskInsertedSubject.asObservable();

  private userPageNumberSubject = new ReplaySubject<number>(1);
  userPageNumber$ = this.userPageNumberSubject.asObservable();

  private projectIdSubject = new ReplaySubject<number>(1);
  projectId$ = this.projectIdSubject.asObservable();

  private taskCategorySelectedSubject = new BehaviorSubject<string>("ALL");
  taskCategorySelectedAction$ = this.taskCategorySelectedSubject.asObservable();

  private selectedProjectSubject = new Subject<IProject>();
  selectedProject$ = this.selectedProjectSubject.asObservable();

  private loadMoreUsersSubject = new ReplaySubject<boolean>(1);
  loadMoreUsers$ = this.loadMoreUsersSubject.asObservable();

  // todo: headers for temp testing of jwt, later replace with HTTP interceptor
  // headers: HttpHeaders = new HttpHeaders({
  //   "Content-Type": "application/json",
  //   Authorization:
  //     "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QyLmNvbSIsInJvbGUiOiJNQU5BR0VSIiwiZXhwIjoxNjU1NTI4MjA3LCJpYXQiOjE2NTQ0NDgyMDd9.5Q_E-hiVNUQSdDHMSTBn2Z4sDQQkKV2ndJszN75Q6KrzCHV8XpJl7zmx3RA37Nf3JQHR0Qy91_Yw7vovc9qHNQ",
  // });

  refresh(): void {
    this.refreshSubject.next();
  }

  projects$: Observable<IProject[]> = this.http
    .get<IProject[]>(`${this.managerUrl}/projects`)
    .pipe(
      tap(() => console.log("called all projects")),
      shareReplay(1),
      catchError(handleError)
    );

  projectsWithAdd$: Observable<IProject[]> = merge(
    this.projects$,
    this.projectInsertedAction$
  ).pipe(
    scan((acc: IProject[], value: IProject) => {
      if (value instanceof Array) return [...value];
      value.tasks = [];
      return [value, ...acc];
    }, [] as IProject[]),
    shareReplay(1),
    catchError(handleError)
  );

  selectedSingleProject$: Observable<IProject> = combineLatest(
    this.projectsWithAdd$,
    this.projectId$
  ).pipe(
    map(([projects, projectId]) =>
      projects.find((project) => project.id === projectId)
    ),
    catchError(handleError)
  );

  users$: Observable<IAppUser[]> = this.userPageNumber$.pipe(
    concatMap((pageNumber) => this.getMoreUsers(pageNumber)),
    tap((pagedUsers: IPagedData<IAppUser>) => {
      if (
        pagedUsers.data.length === 0 ||
        pagedUsers.currentPage > pagedUsers.totalPages
      ) {
        this.loadMoreUsersSubject.next(false);
      }
    }),
    scan(
      (acc: IAppUser[], value: IPagedData<IAppUser>) => [...acc, ...value.data],
      [] as IAppUser[]
    ),
    catchError(handleError)
  );

  tasks$: Observable<ITask[]> = this.selectedProject$.pipe(
    switchMap((project) => of(project.tasks)),
    catchError(handleError)
  );

  tasksWithAdd$: Observable<ITask[]> = merge(
    this.tasks$,
    this.taskInsertedAction$
  ).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [value, ...acc]),
      [] as ITask[]
    ),
    shareReplay(1),
    catchError(handleError)
  );
  constructor(private http: HttpClient) {}

  loadMoreUsers(): void {
    this.loadMoreUsersSubject.next(true);
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
    let params: HttpParams = new HttpParams().set(
      "pageNumber",
      pageNumber.toString()
    );
    return this.http
      .get<IPagedData<IAppUser>>(`${this.managerUrl}/employees`, {
        params: params,
      })
      .pipe(catchError(handleError));
  }

  changeUserPageNumber(userPageNumber: number): void {
    this.userPageNumberSubject.next(userPageNumber);
  }

  addProject(newProject?: IProject): void {
    this.projectInsertedSubject.next(newProject);
  }

  addTask(newTask?: ITask): void {
    this.taskInsertedSubject.next(newTask);
  }

  getAllProjects(): Observable<IProject[]> {
    return this.http
      .get<IProject[]>(`${this.managerUrl}/projects`)
      .pipe(catchError(handleError));
  }

  getAllEmployees(projectId: number): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(`${this.managerUrl}/employees/${projectId}`)
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
      toDate: projectDeadLine.toISOString(),
    };
    return this.http
      .post<IProject>(`${this.managerUrl}/create-project`, requestBody)
      .pipe(
        tap((project) => this.addProject(project)),
        catchError(handleError)
      );
  }

  createTask(
    taskRequestDTO: ITaskRequestDTO,
    projectId: number
  ): Observable<ITask> {
    return this.http
      .post<ITask>(
        `${this.managerUrl}/${projectId}/create-task`,
        taskRequestDTO
      )
      .pipe(
        tap((task) => this.addTask(task)),
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

  deleteTodo(todoId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.managerUrl}/delete-todo/${todoId}`)
      .pipe(
        tap(() => this.refresh()),
        catchError(handleError)
      );
  }
}
