import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  projects$: Observable<IProject[]>;
  users$: Observable<IAppUser[]>;
  currentUserPageNumber: number = 0;
  isLoadingSubject = new BehaviorSubject<boolean>(false);
  private readonly destroy$ = new Subject();
  showLoadMoreButton: boolean;

  get isLoading$() {
    return this.isLoadingSubject.asObservable();
  }

  getMoreUsers(): void {
    this.currentUserPageNumber += 1;
    this.managerService.changeUserPageNumber(this.currentUserPageNumber);
  }

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
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    this.managerService.usersOver$.subscribe({
      next: (usersOver) => (this.showLoadMoreButton = usersOver ? false : true),
      error: (err) => this.snackbarService.showSnackBar(err.message),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.managerService.changeUserPageNumber(0);
  }
}
