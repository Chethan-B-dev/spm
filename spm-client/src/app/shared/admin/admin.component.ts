// angular
import { Component, OnDestroy, OnInit } from "@angular/core";
// material
import { MatDialog } from "@angular/material";

//rxjs
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
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";

// components
import { ConfirmDeleteComponent } from "../dialogs/confirm-delete/confirm-delete.component";

// services
import { AdminApiService } from "../services/admin-api.service";
import { SnackbarService } from "../services/snackbar.service";

// interfaces
import { IAppUser } from "../interfaces/user.interface";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit, OnDestroy {
  defaultUserCategory: string = "UNVERIFIED";

  private searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();

  private isInitialLoadingSubject = new BehaviorSubject<boolean>(true);
  isInitialLoading$ = this.isInitialLoadingSubject.asObservable();

  private readonly destroy$ = new Subject();

  users$: Observable<IAppUser[]> = this.adminApiService.refresh.pipe(
    takeUntil(this.destroy$),
    catchError((err) => {
      this.isInitialLoadingSubject.next(false);
      this.snackbarService.showSnackBar(err);
      return EMPTY;
    }),
    switchMap(() => this.usersWithoutRefresh$),
    tap((_) => this.isInitialLoadingSubject.next(false)),
    catchError((err) => {
      this.isInitialLoadingSubject.next(false);
      this.snackbarService.showSnackBar(err);
      return EMPTY;
    })
  );

  usersWithoutRefresh$: Observable<IAppUser[]> = combineLatest([
    this.adminApiService.getAllUsers(),
    this.adminApiService.userCategorySelectedAction$,
    this.searchTerm$.pipe(debounceTime(500), distinctUntilChanged()),
  ]).pipe(
    takeUntil(this.destroy$),
    map(([users, userSelectedCategory, searchTerm]) =>
      users.filter((user) => {
        if (userSelectedCategory) {
          if (
            userSelectedCategory === "ALL" &&
            this.filterUserBySearchTerm(user, searchTerm)
          )
            return true;
          else if (
            userSelectedCategory === user.status &&
            this.filterUserBySearchTerm(user, searchTerm)
          )
            return true;
          else return false;
        } else {
          return this.filterUserBySearchTerm(user, searchTerm);
        }
      })
    ),
    catchError((err) => {
      this.isInitialLoadingSubject.next(false);
      this.snackbarService.showSnackBar(err);
      return EMPTY;
    })
  );

  constructor(
    public dialog: MatDialog,
    private adminApiService: AdminApiService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchUser(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }

  onUserCategoryChange(selectedUserCategory: string): void {
    this.adminApiService.selectUserCategory(selectedUserCategory);
  }

  takeDecision(userId: number, adminDecision: string): void {
    this.adminApiService
      .takeDecision(userId, adminDecision)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  enableUser(userId: number): void {
    this.adminApiService
      .enableUser(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  openDeleteConfirmDialog(): void {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(result);
      // todo : delete user api call from adminApiService
      // yes returns true
      // no returns false
    });
  }

  private filterUserBySearchTerm(user: IAppUser, searchTerm: string): boolean {
    return (
      user.username!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email!.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
