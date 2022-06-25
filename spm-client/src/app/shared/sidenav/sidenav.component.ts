import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { EMPTY, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { AddProjectComponent } from "src/app/manager/dialogs/add-project/add-project.component";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IAppUser, UserRole } from "../interfaces/user.interface";
import { SnackbarService } from "../services/snackbar.service";
import { DataType, ISearchData, ISearchGroup } from "../utility/common";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild("notifications", { static: false }) notifications: ElementRef;
  isExpanded = false;
  isManager$: Observable<boolean>;
  isEmployee$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  searchResults$: Observable<ISearchGroup[]>;
  currentUser$: Observable<IAppUser>;
  currentUserRole: UserRole;
  private searchTermSubject = new Subject<string>();
  searchTerm$ = this.searchTermSubject.asObservable();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$.pipe(
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    this.currentUser$ = this.authService.currentUser$.pipe(
      filter((currentUser) => Boolean(currentUser)),
      tap((currentUser) => (this.currentUserRole = currentUser.role)),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    this.isAdmin$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isAdmin())),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
    this.isManager$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isManager())),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
    this.isEmployee$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isEmployee())),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    this.searchResults$ = this.searchTerm$.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchTerm) =>
        !searchTerm
          ? of([])
          : this.currentUserRole === UserRole.MANAGER
          ? this.managerService.globalSearch(searchTerm)
          : this.employeeService.globalSearch(searchTerm)
      ),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm.toLowerCase());
  }

  toggleSideNav(): void {
    this.isExpanded = !this.isExpanded;
  }

  openAddProjectDialog(): void {
    this.dialog.open(AddProjectComponent);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  getRedirectLink(type: DataType, searchData: ISearchData): string {
    // todo: redirect to appropriate place for todo and user
    switch (type) {
      case DataType.PROJECT:
        return `/${this.currentUserRole.toLowerCase()}/project-detail/${
          searchData.id
        }`;
      case DataType.ISSUE:
        return `/issue-detail/${searchData.id}`;
      case DataType.TASK:
        return `/${this.currentUserRole.toLowerCase()}/task-detail/${
          searchData.id
        }`;
    }
  }

  clearSearchTerm(): void {
    this.searchTermSubject.next("");
  }

  toggleNotifications(): void {
    const overlay = this.notifications.nativeElement as HTMLElement;
    if (overlay.style.display === "none") {
      this.renderer.setStyle(overlay, "display", "block");
    } else {
      this.renderer.setStyle(overlay, "display", "none");
    }
  }
}
