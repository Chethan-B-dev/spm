// angular
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

// rxjs
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";

// services
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { stopLoading } from "src/app/shared/utility/loading";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUserPageNumber: number = 0;
  showLoadMoreButton: boolean;
  isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();
  projects$: Observable<IProject[]>;
  users$: Observable<IAppUser[]>;
  private readonly destroy$ = new Subject();

  constructor(
    private managerService: ManagerService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.projects$ = this.managerService.projectsWithAdd$.pipe(
      takeUntil(this.destroy$),
      tap((_) => this.isLoadingSubject.next(false)),
      catchError((err) => {
        stopLoading(this.isLoadingSubject);
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    this.users$ = this.managerService.users$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        // this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    this.managerService.usersOver$.subscribe({
      next: (usersOver) => (this.showLoadMoreButton = usersOver ? false : true),
      // error: (err) => this.snackbarService.showSnackBar(err.message),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.managerService.changeUserPageNumber(0);
  }

  getMoreUsers(): void {
    this.currentUserPageNumber += 1;
    this.managerService.changeUserPageNumber(this.currentUserPageNumber);
  }
}
