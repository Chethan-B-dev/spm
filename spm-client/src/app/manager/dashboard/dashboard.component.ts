import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSelect } from "@angular/material";
import * as _ from "lodash";
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  Subject,
} from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  tap,
} from "rxjs/operators";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { getProjectProgress } from "src/app/shared/interfaces/todo.interface";
import {
  AvatarImage,
  IAppUser,
} from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { startLoading, stopLoading } from "src/app/shared/utility/loading";
import { ManagerService } from "../services/manager.service";
import {
  ProjectSort,
  ProjectSortOrder,
} from "./../../shared/interfaces/project.interface";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUserPageNumber = 1;
  currentProjectPageNumber = 1;
  loadMoreUsers$: Observable<boolean>;
  loadMoreProjects$: Observable<boolean>;
  projects$: Observable<IProject[]>;
  users$: Observable<IAppUser[]>;
  errors: string[] = [];

  @ViewChild("sort", { static: false }) sort!: MatSelect;
  @ViewChild("projectSearch", { static: false }) projectSearch!: ElementRef;

  readonly defaultSort = ProjectSort.CREATED;
  readonly defaultSortOrder = ProjectSortOrder.DESCENDING;

  private readonly pageSize = 7;
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  private readonly projectSortSubject = new BehaviorSubject<ProjectSort>(
    this.defaultSort
  );
  readonly projectSort$ = this.projectSortSubject.asObservable();

  private readonly projectSortOrderSubject =
    new BehaviorSubject<ProjectSortOrder>(this.defaultSortOrder);
  readonly projectSortOrder$ = this.projectSortOrderSubject.asObservable();

  private readonly projectSearchSubject = new BehaviorSubject<string>("");
  readonly projectSearch$ = this.projectSearchSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.projects$ = combineLatest(
      this.managerService.projectsWithAdd$,
      this.projectSort$,
      this.projectSortOrder$,
      this.projectSearch$.pipe(debounceTime(500), distinctUntilChanged())
    ).pipe(
      takeUntil(this.destroy$),
      tap(() => startLoading(this.isLoadingSubject)),
      map(([projects, projectSort, projectSortOrder, searchTerm]) => {
        const filteredProjects = projects.filter((project) => {
          const { name, description } = project;
          return (
            name.toLowerCase().includes(searchTerm) ||
            description.toLowerCase().includes(searchTerm)
          );
        });

        this.managerService.loadMoreProjects(
          filteredProjects.length >= this.pageSize
        );

        return this.sortProjects(
          filteredProjects,
          projectSort,
          projectSortOrder
        );
      }),
      tap(() => stopLoading(this.isLoadingSubject)),
      catchError((err) => {
        stopLoading(this.isLoadingSubject);
        this.snackbarService.showSnackBar(err);
        this.errors.push(err);
        return EMPTY;
      })
    );

    this.users$ = this.managerService.users$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.errors.push(err);
        return EMPTY;
      })
    );

    this.initializeLoadMoreButtons();
  }

  onSortChange(sort: ProjectSort) {
    this.projectSortSubject.next(sort);
  }

  onSortOrderChange(sortOrder: ProjectSortOrder) {
    this.projectSortOrderSubject.next(sortOrder);
  }

  searchProject(searchTerm: string): void {
    this.projectSearchSubject.next(searchTerm.trim().toLowerCase());
  }

  initializeLoadMoreButtons(): void {
    this.loadMoreProjects$ = this.managerService.loadMoreProjects$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.errors.push(err);
        return EMPTY;
      })
    );

    this.loadMoreUsers$ = this.managerService.loadMoreUsers$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.errors.push(err);
        return EMPTY;
      })
    );
  }

  getMoreProjects(): void {
    this.currentProjectPageNumber++;
    this.managerService.changeProjectPageNumber(this.currentProjectPageNumber);
  }

  getMoreUsers(): void {
    this.currentUserPageNumber++;
    this.managerService.changeUserPageNumber(this.currentUserPageNumber);
  }

  loadImage(user: IAppUser): string {
    return user.image || AvatarImage;
  }

  resetProjectOptions(): void {
    if (this.sort) {
      this.sort.value = this.defaultSort;
      this.projectSortSubject.next(this.defaultSort);
    }
    if (this.projectSearch) {
      (this.projectSearch.nativeElement as HTMLInputElement).value = "";
      this.projectSearchSubject.next("");
    }
  }

  displayFn(project: IProject): string {
    return project.name || "";
  }

  trackByFn(_: any, project: IProject): number {
    return project.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoadingSubject.complete();
    this.projectSortSubject.complete();
    this.projectSortOrderSubject.complete();
    this.projectSearchSubject.complete();
  }

  private sortProjects(
    projects: IProject[],
    sort: ProjectSort,
    sortOrder: ProjectSortOrder
  ) {
    switch (sort) {
      case ProjectSort.CREATED:
      case ProjectSort.TITLE:
      case ProjectSort.DEADLINE:
        return _.orderBy(projects, sort, sortOrder);
      case ProjectSort.TASKS:
        return projects.sort((first, second) =>
          sortOrder === ProjectSortOrder.DESCENDING
            ? second.tasks.length - first.tasks.length
            : first.tasks.length - second.tasks.length
        );
      case ProjectSort.ISSUES:
        return projects.sort((first, second) =>
          sortOrder === ProjectSortOrder.DESCENDING
            ? second.issues.length - first.issues.length
            : first.issues.length - second.issues.length
        );
      case ProjectSort.EMPLOYEES:
        return projects.sort((first, second) =>
          sortOrder === ProjectSortOrder.DESCENDING
            ? second.users.length - first.users.length
            : first.users.length - second.users.length
        );
      case ProjectSort.PROGRESS:
        return projects.sort((first, second) =>
          sortOrder === ProjectSortOrder.DESCENDING
            ? getProjectProgress(second.tasks) - getProjectProgress(first.tasks)
            : getProjectProgress(first.tasks) - getProjectProgress(second.tasks)
        );
      default:
        return projects;
    }
  }
}
