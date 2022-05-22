// angular
import { Component, OnDestroy, OnInit } from "@angular/core";
// material
import { MatDialog, MatSnackBar } from "@angular/material";

//rxjs
import { BehaviorSubject, combineLatest, EMPTY, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import { ConfirmDeleteComponent } from "../dialogs/confirm-delete/confirm-delete.component";
import { IAppUser } from "../interfaces/user.interface";
import { AdminApiService } from "../services/admin-api.service";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit, OnDestroy {
  defaultUserCategory: string = "UNVERIFIED";
  private searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private readonly destroy$ = new Subject();

  users$ = this.adminApiService.refresh.pipe(
    takeUntil(this.destroy$),
    switchMap(() => this.usersWithoutRefresh$)
  );

  searchUser(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }

  usersWithoutRefresh$ = combineLatest([
    this.adminApiService.getAllUsers(),
    this.adminApiService.userCategorySelectedAction,
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
      this.showSnackBar(err.message);
      this.errorMessageSubject.next(err.message);
      return EMPTY;
    })
  );

  constructor(
    public dialog: MatDialog,
    private adminApiService: AdminApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private filterUserBySearchTerm(user: IAppUser, searchTerm: string) {
    return (
      user.username!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email!.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
          this.showSnackBar(err.message);
          this.errorMessageSubject.next(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private showSnackBar(message: string, duration?: number) {
    this.snackBar.open(message, "Close", {
      duration: duration ? duration : 3000,
    });
  }

  enableUser(userId: number): void {
    this.adminApiService
      .enableUser(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.showSnackBar(err.message);
          this.errorMessageSubject.next(err.message);
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
}
