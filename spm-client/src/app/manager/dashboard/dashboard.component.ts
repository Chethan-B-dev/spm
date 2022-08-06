// angular
import { Component, OnDestroy, OnInit } from "@angular/core";

// rxjs
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";

// services
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  AvatarImage,
  IAppUser,
} from "src/app/shared/interfaces/user.interface";
import { stopLoading } from "src/app/shared/utility/loading";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUserPageNumber = 1;
  currentProjectPageNumber = 1;
  loadMoreUsers$: Observable<boolean>;
  loadMoreProjects$: Observable<boolean>;
  projects$: Observable<IProject[]>;
  users$: Observable<IAppUser[]>;
  errors: string[] = [];
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.managerService.projectsWithAdd$.pipe(
      takeUntil(this.destroy$),
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
        // this.snackbarService.showSnackBar(err);
        this.errors.push(err);
        return EMPTY;
      })
    );

    this.initializeLoadMoreButtons();
  }

  initializeLoadMoreButtons(): void {
    this.loadMoreProjects$ = this.managerService.loadMoreProjects$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        // this.snackbarService.showSnackBar(err);
        this.errors.push(err);
        return EMPTY;
      })
    );

    this.loadMoreUsers$ = this.managerService.loadMoreUsers$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        // this.snackbarService.showSnackBar(err);
        this.errors.push(err);
        return EMPTY;
      })
    );
  }

  loadMoreProjects(): void {
    this.currentProjectPageNumber += 1;
    this.managerService.changeProjectPageNumber(this.currentProjectPageNumber);
  }

  loadImage(user: IAppUser): string {
    return user.image || AvatarImage;
  }

  getMoreUsers(): void {
    this.currentUserPageNumber += 1;
    this.managerService.changeUserPageNumber(this.currentUserPageNumber);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
