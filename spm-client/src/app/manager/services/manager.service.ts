// angular
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

// rxjs
import { BehaviorSubject, merge, Observable, of, Subject } from "rxjs";
import { catchError, concatMap, scan, switchMap, tap } from "rxjs/operators";

// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  ITask,
  ITaskRequestDTO,
} from "src/app/shared/interfaces/task.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";

// utility
import { handleError } from "src/app/shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class ManagerService {
  //todo: get this url from env variable
  private managerUrl = "http://localhost:8081/api/manager";
  private refreshSubject = new BehaviorSubject(null);

  private projectInsertedSubject = new Subject<IProject>();
  projectInsertedAction$ = this.projectInsertedSubject.asObservable();

  private taskInsertedSubject = new Subject<ITask>();
  taskInsertedAction$ = this.taskInsertedSubject.asObservable();

  private userPageNumberSubject = new BehaviorSubject<number>(0);
  userPageNumber$ = this.userPageNumberSubject.asObservable();

  private readonly usersOverSubject = new BehaviorSubject<boolean>(false);
  usersOver$ = this.usersOverSubject.asObservable();

  private projectIdSubject = new Subject<number>();
  projectId$ = this.projectIdSubject.asObservable();

  private taskCategorySelectedSubject = new BehaviorSubject<string>("ALL");
  taskCategorySelectedAction$ = this.taskCategorySelectedSubject.asObservable();

  private selectedProjectSubject = new Subject<IProject>();
  selectedProject$ = this.selectedProjectSubject.asObservable();

  // todo: headers for temp testing of jwt, later replace with HTTP interceptor
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QyLmNvbSIsInJvbGUiOiJNQU5BR0VSIiwiZXhwIjoxNjU0MzU1ODYxLCJpYXQiOjE2NTMyNzU4NjF9.EGJLB4va1thGRQhrGav5l9S8LX3M8XPJTBhvhpKnEeo_qRDj_hm46ze0C3ff-1GcvOzgs3JJvT4eTRVNkUa1jQ",
  });

  projects$ = this.http
    .get<IProject[]>(`${this.managerUrl}/projects`, { headers: this.headers })
    .pipe(catchError(handleError));

  projectsWithAdd$ = merge(this.projects$, this.projectInsertedAction$).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [value, ...acc]),
      [] as IProject[]
    ),
    catchError(handleError)
  );

  users$ = this.userPageNumber$.pipe(
    tap((pageNumber) => {
      if (pageNumber === 0) this.usersOverSubject.next(false);
    }),
    concatMap((pageNumber) => this.getMoreUsers(pageNumber)),
    tap((data) => {
      if (data.length === 0) this.usersOverSubject.next(true);
    }),
    scan((acc, value) => [...acc, ...value], [] as IAppUser[]),
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
    catchError(handleError)
  );

  constructor(private http: HttpClient) {}

  get refresh() {
    return this.refreshSubject.asObservable();
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
      .get<ITask[]>(`${this.managerUrl}/tasks/${projectId}`, {
        headers: this.headers,
      })
      .pipe(catchError(handleError));
  }

  getMoreUsers(pageNumber: number): Observable<IAppUser[]> {
    let params: HttpParams = new HttpParams().set(
      "pageNumber",
      pageNumber.toString()
    );
    return this.http
      .get<IAppUser[]>(`${this.managerUrl}/employees`, {
        params: params,
        headers: this.headers,
      })
      .pipe(catchError(handleError));
  }

  changeUserPageNumber(userPageNumber: number): void {
    this.userPageNumberSubject.next(userPageNumber);
  }

  addProject(newProject?: IProject) {
    this.projectInsertedSubject.next(newProject);
  }

  addTask(newTask?: ITask) {
    this.taskInsertedSubject.next(newTask);
  }

  getAllProjects(): Observable<IProject[]> {
    return this.http
      .get<IProject[]>(`${this.managerUrl}/projects`, { headers: this.headers })
      .pipe(catchError(handleError));
  }

  getAllEmployees(projectId: number): Observable<IAppUser[]> {
    return this.http
      .get<IAppUser[]>(`${this.managerUrl}/employees/${projectId}`, {
        headers: this.headers,
      })
      .pipe(catchError(handleError));
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
        catchError(handleError)
      );
  }

  getProjectById(projectId: number): Observable<IProject> {
    return this.http
      .get<IProject>(`${this.managerUrl}/project/${projectId}`, {
        headers: this.headers,
      })
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
      .post<IProject>(`${this.managerUrl}/create-project`, requestBody, {
        headers: this.headers,
      })
      .pipe(
        tap((project) => this.addProject(project)),
        catchError(handleError)
      );
  }

  createTask(
    taskRequestDTO: ITaskRequestDTO,
    projectId: number
  ): Observable<ITask> {
    const requestBody = {
      ...taskRequestDTO,
    };
    return this.http
      .post<ITask>(`${this.managerUrl}/${projectId}/create-task`, requestBody, {
        headers: this.headers,
      })
      .pipe(
        tap((task) => this.addTask(task)),
        catchError(handleError)
      );
  }
}
