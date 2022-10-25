import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { EMPTY, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { ConnectionService } from "src/app/connection.service";
import { EmployeeService } from "src/app/employee/employee.service";
import { AddProjectComponent } from "src/app/manager/dialogs/add-project/add-project.component";
import { ManagerService } from "src/app/manager/services/manager.service";
import { INotification } from "../interfaces/notification.interface";
import { IAppUser, UserRole } from "../interfaces/user.interface";
import { NotificationService } from "../notification.service";
import { SnackbarService } from "../services/snackbar.service";
import { DataType, ISearchData, ISearchGroup } from "../utility/common";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild("notifications", { static: false }) notifications: ElementRef;
  @HostListener("document:click", ["$event"]) onDocumentClick(
    event: MouseEvent
  ) {
    if (
      this.notifications &&
      this.notifications.nativeElement &&
      !this.notifications.nativeElement.contains(event.target)
    ) {
      this.renderer.setStyle(
        this.notifications.nativeElement as HTMLElement,
        "display",
        "none"
      );
    }
  }
  isExpanded = false;
  isOnline = true;
  isLoggedIn$: Observable<boolean>;
  searchResults$: Observable<ISearchGroup[]>;
  currentUser$: Observable<IAppUser>;
  currentUserRole: UserRole;
  currentUserId: number;
  notificationMessages: INotification[] = [];
  private readonly searchTermSubject = new Subject<string>();
  readonly searchTerm$ = this.searchTermSubject.asObservable();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService,
    private readonly notificationService: NotificationService,
    private readonly connectionService: ConnectionService,
    private readonly router: Router,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.connectionService
      .monitor()
      .pipe(takeUntil(this.destroy$))
      .subscribe((online) => (this.isOnline = online));

    this.isLoggedIn$ = this.authService.isLoggedIn$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      }),
      shareReplay(1)
    );

    this.currentUser$ = this.authService.currentUser$.pipe(
      filter((currentUser) => Boolean(currentUser)),
      takeUntil(this.destroy$),
      tap((currentUser) => {
        this.currentUserRole = currentUser.role;
        this.currentUserId = currentUser.id;
      }),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      }),
      shareReplay(1)
    );

    this.searchResults$ = this.searchTerm$.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchTerm) => this.performSearch(searchTerm)),
      map((groups) => groups.filter((group) => group.data.length)),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    // todo: uncomment this if you want notifications enabled
    // this.populateNotifications();
  }

  deleteNotification(notificationId: string): void {
    this.notificationService.deleteNotification(notificationId);
  }

  deleteAllNotifications(): void {
    const notifications = [...this.notificationMessages];
    this.notificationMessages = [];
    // todo: check if this works
    notifications.forEach((notification) =>
      this.deleteNotification(notification.id)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTermSubject.complete();
  }

  search(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm.trim().toLowerCase());
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

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    const overlay = this.notifications.nativeElement as HTMLElement;
    if (overlay.style.display === "none") {
      this.renderer.setStyle(overlay, "display", "block");
    } else {
      this.renderer.setStyle(overlay, "display", "none");
    }
  }

  private performSearch(searchTerm) {
    if (!searchTerm) {
      return of([]);
    }
    if (this.currentUserRole === UserRole.MANAGER) {
      return this.managerService.globalSearch(searchTerm);
    }
    return this.employeeService.globalSearch(searchTerm);
  }

  private populateNotifications(): void {
    this.currentUser$
      .pipe(
        tap(() => console.log("notification code running")),
        pluck("id"),
        switchMap((currentUserId) =>
          this.notificationService.getAllNotifications().pipe(
            map((snapshots) =>
              snapshots.map(
                (snapshot) =>
                  ({
                    id: snapshot.payload.doc.id,
                    ...snapshot.payload.doc.data(),
                  } as INotification)
              )
            ),
            map((notifications: INotification[]) =>
              notifications.filter(
                (notification) => notification.userId === currentUserId
              )
            ),
            map((notifications) =>
              notifications.sort((a, b) => b.time - a.time)
            )
          )
        )
      )
      .subscribe(
        (notifications) => (this.notificationMessages = notifications)
      );
  }
}
