import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { goBack } from "src/app/shared/utility/common";

@Component({
  selector: "app-emp-report-list",
  templateUrl: "./emp-report-list.component.html",
  styleUrls: ["./emp-report-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReportListComponent implements OnInit, OnDestroy {
  users$: Observable<IAppUser[]>;
  projectId: number;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  goBack(): void {
    goBack();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      this.projectId = +paramMap.get("projectId");
    });

    this.users$ = this.managerService.refresh$.pipe(
      takeUntil(this.destroy$),
      switchMap(() =>
        this.managerService.getEmployeesUnderProject(this.projectId)
      ),
      catchError(() => {
        this.router.navigate(["/reporting"]);
        return EMPTY;
      })
    );
  }
}
