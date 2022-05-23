import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  tap,
  catchError,
  scan,
  map,
  shareReplay,
  switchMap,
  concatMap,
  mergeScan,
  filter,
  takeUntil,
} from "rxjs/operators";
import {
  BehaviorSubject,
  combineLatest,
  from,
  merge,
  Observable,
  of,
  Subject,
  throwError,
} from "rxjs";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { handleError } from "src/app/shared/utility/error";
import { IPageResult } from "src/app/shared/interfaces/page.interface";

@Injectable({
  providedIn: "root",
})
export class ManagerService {
  private managerUrl = "http://localhost:8080/api/manager";
  private refreshSubject = new BehaviorSubject(null);

  private projectInsertedSubject = new Subject<IProject>();
  projectInsertedAction$ = this.projectInsertedSubject.asObservable();

  private userPageNumberSubject = new BehaviorSubject<number>(0);
  userPageNumber$ = this.userPageNumberSubject.asObservable();

  private readonly usersOverSubject = new BehaviorSubject<boolean>(false);
  usersOver$ = this.usersOverSubject.asObservable();

  get refresh() {
    return this.refreshSubject.asObservable();
  }

  // todo: headers for temp testing of jwt, later replace with HTTP interceptor
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QyLmNvbSIsInJvbGUiOiJNQU5BR0VSIiwiZXhwIjoxNjU0MzU1ODYxLCJpYXQiOjE2NTMyNzU4NjF9.EGJLB4va1thGRQhrGav5l9S8LX3M8XPJTBhvhpKnEeo_qRDj_hm46ze0C3ff-1GcvOzgs3JJvT4eTRVNkUa1jQ",
  });

  constructor(private http: HttpClient) {}

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
      if (data.length === 0) {
        this.usersOverSubject.next(true);
      }
    }),
    scan((acc, value) => [...acc, ...value], [] as IAppUser[]),
    catchError(handleError)
  );

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
}
