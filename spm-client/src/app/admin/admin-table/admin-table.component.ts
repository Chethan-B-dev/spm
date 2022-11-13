import { AdminService } from "./../admin.service";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { BehaviorSubject, Subject } from "rxjs";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { AdminColumns } from "../admin.constants";

/*
{
    position: 1,
    name: "Hydrogen",
    weight: 1.0079,
    symbol: "H",
    description: `Hydrogen is a chemical element`,
  },
*/

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
export class AdminTableComponent implements OnInit {
  rows$ = this.adminService.users$;
  readonly emptyValue = "- - - -";
  readonly columns = AdminColumns;
  columnsToDisplayWithExpand = [...this.columns, "expand"];
  expandedUser: IAppUser | null;

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {}

  openFilter(): void {
    console.log("filter opened");
  }
}
