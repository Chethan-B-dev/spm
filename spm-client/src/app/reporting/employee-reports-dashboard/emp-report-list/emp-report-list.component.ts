import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { goBack } from "src/app/shared/utility/common";

@Component({
  selector: "app-emp-report-list",
  templateUrl: "./emp-report-list.component.html",
  styleUrls: ["./emp-report-list.component.scss"],
})
export class EmpReportListComponent implements OnInit {
  users$: Observable<IAppUser[]>;
  projectId: number;

  constructor(
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private route: ActivatedRoute
  ) {}

  goBack(): void {
    goBack();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = +paramMap.get("projectId");
    });

    this.users$ = this.managerService.refresh$.pipe(
      switchMap(() =>
        this.managerService.getEmployeesUnderProject(this.projectId)
      ),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }
}
