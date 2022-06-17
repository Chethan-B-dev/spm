import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { BehaviorSubject, EMPTY, Observable, of, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { AddProjectComponent } from "src/app/manager/dialogs/add-project/add-project.component";
import { ManagerService } from "src/app/manager/services/manager.service";
import { EditProfileComponent } from "../dialogs/edit-profile/edit-profile.component";
import { ITodo } from "../interfaces/todo.interface";
import { IAppUser, UserRole } from "../interfaces/user.interface";
import { SnackbarService } from "../services/snackbar.service";
import {
  DataType,
  ISearchData,
  ISearchGroup,
  ISearchResult,
} from "../utility/common";

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};
@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit, OnDestroy {
  isExpanded: boolean = false;
  isManager$: Observable<boolean>;
  isEmployee$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  @ViewChild("notifications", { static: false }) notifications: ElementRef;
  searchResults$: Observable<ISearchGroup[]>;
  private searchTermSubject = new Subject<string>();
  searchTerm$ = this.searchTermSubject.asObservable();
  private readonly destroy$ = new Subject<void>();
  currentUser$: Observable<IAppUser> = this.authService.currentUser$;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private managerService: ManagerService,
    private snackbarService: SnackbarService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isAdmin$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isAdmin()))
    );
    this.isManager$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isManager()))
    );
    this.isEmployee$ = this.authService.isLoggedIn$.pipe(
      switchMap(() => of(this.authService.isEmployee()))
    );

    this.searchResults$ = this.searchTerm$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      debounceTime(500),
      switchMap((searchTerm) =>
        !searchTerm ? of([]) : this.managerService.globalSearch(searchTerm)
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
    const dialogRef = this.dialog.open(AddProjectComponent);
    dialogRef.afterClosed().subscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  getRedirectLink(type: DataType, searchData: ISearchData): string {
    // todo: redirect to appropriate place for todo and user and issue
    switch (type) {
      case DataType.PROJECT:
        return `/manager/project-detail/${searchData.id}`;
      case DataType.ISSUE:
        return `/manager/issue-detail/${searchData.id}`;
      case DataType.TASK:
        return `/manager/task-detail/${searchData.id}`;
      case DataType.TODO:
        return `/manager/todo-detail/${searchData.id}`;
      case DataType.USER:
        return `/manager/project-detail/${searchData.id}`;
    }
  }

  // getHomeLink(currentUser: IAppUser): void {
  //   switch (currentUser.role) {
  //     case UserRole.MANAGER:
  //       this.router.navigate(["manager"]);
  //       break;
  //     case UserRole.EMPLOYEE:
  //       this.router.navigate(["employee"]);
  //       break;
  //     case UserRole.ADMIN:
  //       this.router.navigate(["admin"]);
  //       break;
  //   }
  // }

  toggleNotifications(): void {
    const overlay = this.notifications.nativeElement as HTMLElement;
    if (overlay.style.display === "none") {
      this.renderer.setStyle(overlay, "display", "block");
    } else {
      this.renderer.setStyle(overlay, "display", "none");
    }
  }
}
