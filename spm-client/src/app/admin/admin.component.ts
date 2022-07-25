// angular
import { Component, OnDestroy, OnInit } from "@angular/core";
//rxjs
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Subject,
  Subscription,
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
import { IAppUser } from "../shared/interfaces/user.interface";
import { AdminApiService } from "../shared/services/admin-api.service";
import { SnackbarService } from "../shared/services/snackbar.service";
import { stopLoading } from "../shared/utility/loading";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnDestroy, OnInit {
  defaultUserCategory = "UNVERIFIED";

  private searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly subscriptions = [] as Subscription[];

  private readonly destroy$ = new Subject<void>();

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
    private readonly adminApiService: AdminApiService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.onUserCategoryChange(this.defaultUserCategory);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  private filterUserBySearchTerm(user: IAppUser, searchTerm: string): boolean {
    return (
      user.username.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      (user.designation && user.designation.toLowerCase().includes(searchTerm))
    );
  }
}
