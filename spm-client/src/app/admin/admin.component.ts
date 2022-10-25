import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { BehaviorSubject, combineLatest, EMPTY, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  tap,
} from "rxjs/operators";
import { IAppUser } from "../shared/interfaces/user.interface";
import { SnackbarService } from "../shared/services/snackbar.service";
import { startLoading, stopLoading } from "../shared/utility/loading";
import { UserStatus } from "./../shared/interfaces/user.interface";
import { AdminService } from "./admin.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit, OnDestroy {
  defaultUserCategory = UserStatus.UNVERIFIED;

  private readonly searchTermSubject = new BehaviorSubject<string>("");
  readonly searchTerm$ = this.searchTermSubject.asObservable();

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  users$ = combineLatest([
    this.adminService.usersWithAction$,
    this.adminService.userCategorySelectedAction$,
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ),
  ]).pipe(
    takeUntil(this.destroy$),
    tap(() => startLoading(this.isLoadingSubject)),
    map(([users, userSelectedCategory, searchTerm]) => {
      if (userSelectedCategory === UserStatus.ALL && !searchTerm) {
        return users;
      }
      return users.filter((user) => {
        if (
          (userSelectedCategory === UserStatus.ALL &&
            this.filterUserBySearchTerm(user, searchTerm)) ||
          (userSelectedCategory === user.status &&
            this.filterUserBySearchTerm(user, searchTerm))
        ) {
          return true;
        }
        return false;
      });
    }),
    tap(() => stopLoading(this.isLoadingSubject)),
    catchError((err) => {
      stopLoading(this.isLoadingSubject);
      this.snackbarService.showSnackBar(err);
      return EMPTY;
    })
  );

  constructor(
    private readonly adminService: AdminService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.onUserCategoryChange(this.defaultUserCategory);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoadingSubject.complete();
    this.searchTermSubject.complete();
  }

  searchUser(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm.trim().toLowerCase());
  }

  onUserCategoryChange(selectedUserCategory: string): void {
    this.adminService.selectUserCategory(selectedUserCategory);
  }

  takeDecision(userId: number, adminDecision: string): void {
    this.adminService
      .takeDecision(userId, adminDecision)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.snackbarService.showSnackBar(
          `user has been ${adminDecision.toLowerCase()}ed`
        );
      });
  }

  enableUser(userId: number): void {
    this.adminService
      .enableUser(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((user) => {
        this.snackbarService.showSnackBar(`${user.username} has been enabled`);
      });
  }

  private filterUserBySearchTerm(user: IAppUser, searchTerm: string): boolean {
    return (
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  }
}
