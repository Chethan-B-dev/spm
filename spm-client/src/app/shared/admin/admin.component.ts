// angular
import { Component, OnDestroy } from "@angular/core";
// material
import { MatDialog } from "@angular/material";
//rxjs
import { BehaviorSubject, combineLatest, EMPTY, Subject, Subscription } from "rxjs";
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
// interfaces
import { IAppUser } from "../interfaces/user.interface";
// services
import { AdminApiService } from "../services/admin-api.service";
import { SnackbarService } from "../services/snackbar.service";
import { stopLoading } from "../utility/loading";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnDestroy {
  defaultUserCategory = "UNVERIFIED";

  private searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly subscriptions = [] as Subscription[];

  private readonly destroy$ = new Subject();

  users$ = this.adminApiService.refresh$.pipe(
    takeUntil(this.destroy$),
    switchMap(() => this.usersWithoutRefresh$),
    tap(() => stopLoading(this.isLoadingSubject)),
    catchError((err) => {
      stopLoading(this.isLoadingSubject);
      this.snackbarService.showSnackBar(err);
      return EMPTY;
    })
  );

  usersWithoutRefresh$ = combineLatest([
    this.adminApiService.getAllUsers(),
    this.adminApiService.userCategorySelectedAction$,
    this.searchTerm$.pipe(debounceTime(500), distinctUntilChanged()),
  ]).pipe(
    takeUntil(this.destroy$),
    map(([users, userSelectedCategory, searchTerm]) => {
      if (userSelectedCategory === "ALL" && !searchTerm) return users;
      return users.filter((user) => {
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
        return false;
      });
    }),
    catchError((err) => {
      stopLoading(this.isLoadingSubject);
      this.snackbarService.showSnackBar(err);
      return EMPTY;
    })
  );

  constructor(
    public dialog: MatDialog,
    private readonly adminApiService: AdminApiService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  searchUser(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm.trim().toLowerCase());
  }

  onUserCategoryChange(selectedUserCategory: string): void {
    this.adminApiService.selectUserCategory(selectedUserCategory);
  }

  takeDecision(userId: number, adminDecision: string): void {
    const takeDecisionSubscription = this.adminApiService
      .takeDecision(userId, adminDecision)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.adminApiService.refresh();
        this.snackbarService.showSnackBar(
          `user has been ${adminDecision.toLowerCase()}ed`
        );
      });
    this.subscriptions.push(takeDecisionSubscription);
  }

  enableUser(userId: number): void {
    const enableUserSubscription = this.adminApiService
      .enableUser(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.adminApiService.refresh();
        this.snackbarService.showSnackBar(`user has been enabled`);
      });
    this.subscriptions.push(enableUserSubscription);
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
      user.username.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      (user.designation && user.designation.toLowerCase().includes(searchTerm))
    );
  }
}
