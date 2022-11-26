import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { BehaviorSubject, combineLatest, EMPTY, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
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
  readonly userCategory = this.adminService.getUserCategory();
  readonly searchTerm = this.adminService.getSearchTerm();

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  private readonly usersSubject = new BehaviorSubject<IAppUser[]>([]);
  readonly usersAction$ = this.usersSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  users$ = combineLatest(
    this.usersAction$,
    this.adminService.userCategorySelectedAction$,
    this.adminService.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    )
  ).pipe(
    takeUntil(this.destroy$),
    tap(() => startLoading(this.isLoadingSubject)),
    map(([users, status, searchTerm]) => {
      // if status is all and search term is empty return all the users
      if (status === UserStatus.ALL && !searchTerm) {
        return users;
      }
      // if status is not all and search term is empty filter users by the selected status
      if (!searchTerm) {
        return users.filter((user) => user.status === status);
      }
      // if search term is not empty filter by the search term and selected status
      return users.filter((user: IAppUser) => {
        return (
          (status === UserStatus.ALL || status === user.status) &&
          this.filterUserBySearchTerm(user, searchTerm)
        );
      });
    }),
    tap(() => stopLoading(this.isLoadingSubject)),
    catchError((err) => {
      this.snackbarService.showSnackBar(err);
      return of([]);
    }),
    finalize(() => stopLoading(this.isLoadingSubject))
  );

  vm$ = combineLatest(this.users$, this.isLoading$).pipe(
    takeUntil(this.destroy$),
    map(([users, isLoading]) => ({
      users,
      isLoading,
    }))
  );

  constructor(
    private readonly adminService: AdminService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initializeUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoadingSubject.complete();
    this.usersSubject.complete();
  }

  searchUser(searchTerm: string): void {
    this.adminService.searchUser(searchTerm);
  }

  onUserCategoryChange(selectedUserCategory: string): void {
    this.adminService.onUserCategoryChange(selectedUserCategory);
  }

  takeDecision(userId: number, adminDecision: string): void {
    this.adminService
      .takeDecision(userId, adminDecision)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => EMPTY)
      )
      .subscribe((user: IAppUser) => {
        this.setUser(user);
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
        catchError(() => EMPTY)
      )
      .subscribe((user: IAppUser) => {
        this.setUser(user);
        this.snackbarService.showSnackBar(`${user.username} has been enabled`);
      });
  }

  private initializeUsers(): void {
    this.adminService
      .getAllUsers()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of([]))
      )
      .subscribe((users) => this.usersSubject.next(users));
  }

  private setUser(newUser: IAppUser): void {
    const currentUsers = this.usersSubject.getValue();
    this.usersSubject.next(
      currentUsers.map((user) => (user.id === newUser.id ? newUser : user))
    );
  }

  private filterUserBySearchTerm(user: IAppUser, searchTerm: string): boolean {
    return (
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  }
}
