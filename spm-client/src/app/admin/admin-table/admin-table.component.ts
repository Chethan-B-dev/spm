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
import { BehaviorSubject, Subject } from "rxjs";
import {
  AvatarImage,
  IAppUser,
} from "src/app/shared/interfaces/user.interface";
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
  rows$ = this.adminService.users$;
  readonly emptyValue = "- - - -";
  readonly defaultAvatar = AvatarImage;
  private readonly columnsSubject = new BehaviorSubject<string[]>([]);
  readonly columns$ = this.columnsSubject.asObservable();
  private readonly columnsToDisplayWithExpandSubject = new BehaviorSubject<
    string[]
  >([]);
  readonly columnsToDisplayWithExpand$ =
    this.columnsToDisplayWithExpandSubject.asObservable();
  expandedUser: IAppUser | null;

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly adminService: AdminService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setColumns();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoadingSubject.complete();
    this.columnsSubject.complete();
    this.columnsToDisplayWithExpandSubject.complete();
  }

  openColumnSelector() {
    const dialogRef = this.dialog.open(ColumnSelectorComponent);

    dialogRef.afterClosed().subscribe((visibleColumns: string[]) => {
      if (visibleColumns) {
        this.setTableColumns(visibleColumns);
      }
    });
  }

  setColumns() {
    const visibleFields = JSON.parse(localStorage.getItem("visibleFields"));
    if (!visibleFields) {
      this.setDefaultColumns();
      return;
    }
    this.setTableColumns(visibleFields);
  }

  setDefaultColumns() {
    const visibleDefaultColumns = AdminColumns.reduce((columns, column) => {
      if (column.fieldType === Field.VISIBLE) {
        columns.push(column.name);
      }
      return columns;
    }, []);

    this.setTableColumns(visibleDefaultColumns);
  }

  private setTableColumns(columns: string[]): void {
    this.columnsSubject.next(columns);
    this.columnsToDisplayWithExpandSubject.next([...columns, "expand"]);
  }
}
