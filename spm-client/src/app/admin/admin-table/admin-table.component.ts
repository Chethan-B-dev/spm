import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, map, mergeMap, takeUntil, toArray } from "rxjs/operators";
import { EmployeeService } from "src/app/employee/employee.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import {
  AvatarImage,
  IAppUser,
  UserRole,
} from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { AdminColumns } from "../admin.constants";
import { ColumnSelectorComponent } from "../column-selector/column-selector.component";
import { Field } from "./../admin.constants";
import { AdminService } from "./../admin.service";

@Component({
  selector: "app-admin-table",
  templateUrl: "./admin-table.component.html",
  styleUrls: ["./admin-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class AdminTableComponent implements OnInit, OnDestroy {
  rows$: Observable<IAppUser[]>;
  expandedUser: IAppUser | null;
  readonly emptyValue = "- - - -";
  readonly defaultAvatar = AvatarImage;
  private readonly columnsSubject = new BehaviorSubject<string[]>([]);
  readonly columns$ = this.columnsSubject.asObservable();
  private readonly columnsToDisplayWithExpandSubject = new BehaviorSubject<
    string[]
  >([]);
  readonly columnsToDisplayWithExpand$ =
    this.columnsToDisplayWithExpandSubject.asObservable();

  private readonly currentUserProjectsSubject = new BehaviorSubject<string[]>(
    []
  );
  readonly currentUserProjects$ =
    this.currentUserProjectsSubject.asObservable();

  private readonly userProjectsCache = new Map<number, string[]>();

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly adminService: AdminService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.rows$ = this.adminService.users$.pipe(
      takeUntil(this.destroy$),
      catchError(() => of([]))
    );

    this.setColumns();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoadingSubject.complete();
    this.columnsSubject.complete();
    this.columnsToDisplayWithExpandSubject.complete();
    this.currentUserProjectsSubject.complete();
  }

  fetchProjects(user: IAppUser): Observable<string[]> {
    switch (user.role) {
      case UserRole.MANAGER:
        return this.managerService.getAllProjectsById(user.id).pipe(
          takeUntil(this.destroy$),
          mergeMap((projects) => projects),
          map((project) => project.name),
          toArray(),
          catchError(() => of([]))
        );
      case UserRole.EMPLOYEE:
        return this.employeeService.getAllProjectsById(user.id).pipe(
          takeUntil(this.destroy$),
          mergeMap((projects) => projects),
          map((project) => project.name),
          toArray(),
          catchError(() => of([]))
        );
      default:
        return of([]);
    }
  }

  onExpandClick(event: MouseEvent, user: IAppUser): void {
    this.expandedUser = this.expandedUser === user ? null : user;
    event.stopPropagation();
    if (this.expandedUser) {
      if (this.userProjectsCache.has(this.expandedUser.id)) {
        this.currentUserProjectsSubject.next(
          this.userProjectsCache.get(this.expandedUser.id)
        );
        return;
      }
      this.currentUserProjectsSubject.next([]);
      this.fetchProjects(this.expandedUser).subscribe((projects) => {
        this.currentUserProjectsSubject.next(projects);
        this.userProjectsCache.set(this.expandedUser.id, projects);
      });
    }
  }

  openColumnSelector(): void {
    const dialogRef = this.dialog.open(ColumnSelectorComponent);
    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of(null))
      )
      .subscribe((visibleColumns: string[]) => {
        if (visibleColumns) {
          this.setTableColumns(visibleColumns);
        }
      });
  }

  setColumns(): void {
    const visibleFields = JSON.parse(localStorage.getItem("visibleFields"));
    if (!visibleFields) {
      this.setDefaultColumns();
      return;
    }
    this.setTableColumns(visibleFields);
    this.snackbarService.showSnackBar(
      "Previously selected columns applied",
      1500
    );
  }

  private setDefaultColumns(): void {
    const visibleDefaultColumns = AdminColumns.reduce((columns, column) => {
      if (column.fieldType === Field.VISIBLE) {
        columns.push(column.name);
      }
      return columns;
    }, [] as string[]);

    this.setTableColumns(visibleDefaultColumns);
  }

  private setTableColumns(columns: string[]): void {
    this.columnsSubject.next(columns);
    this.columnsToDisplayWithExpandSubject.next([...columns, "expand"]);
  }
}
