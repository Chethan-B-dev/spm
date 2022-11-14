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
import { IAppUser } from "src/app/shared/interfaces/user.interface";
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

  // todo: code it such that atleast one visible column is there in column selector

  ngOnInit(): void {
    this.setColumns();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoadingSubject.complete();
    this.columnsSubject.complete();
  }

  openColumnSelector() {
    const dialogRef = this.dialog.open(ColumnSelectorComponent);

    dialogRef.afterClosed().subscribe((visibleColumns: string[]) => {
      if (visibleColumns) {
        this.columnsSubject.next(visibleColumns);
        this.columnsToDisplayWithExpandSubject.next([
          ...this.columnsSubject.getValue(),
          "expand",
        ]);
      }
    });
  }

  setColumns() {
    const visibleFields = JSON.parse(localStorage.getItem("visibleFields"));
    if (!visibleFields) {
      this.setDefaultColumns();
      return;
    }
    this.columnsSubject.next(visibleFields);
    this.columnsToDisplayWithExpandSubject.next([...visibleFields, "expand"]);
  }

  setDefaultColumns() {
    this.columnsSubject.next(
      AdminColumns.filter((column) => column.fieldType === Field.VISIBLE).map(
        (column) => column.name
      )
    );

    this.columnsToDisplayWithExpandSubject.next([
      ...this.columnsSubject.getValue(),
      "expand",
    ]);
  }
}
