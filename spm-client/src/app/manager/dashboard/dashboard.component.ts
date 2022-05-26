// angular
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

// rxjs
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";

// services
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUserPageNumber: number = 0;
  showLoadMoreButton: boolean;
  isLoadingSubject = new BehaviorSubject<boolean>(false);
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
      catchError((err) => {
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

  get isLoading$() {
    return this.isLoadingSubject.asObservable();
  }

  getMoreUsers(): void {
    this.currentUserPageNumber += 1;
    this.managerService.changeUserPageNumber(this.currentUserPageNumber);
  }
}
