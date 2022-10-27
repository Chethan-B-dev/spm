import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { IAppUser } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { stopLoading } from "src/app/shared/utility/loading";
import { EmployeeService } from "../employee.service";

@Component({
  selector: "app-employee-dashboard",
  templateUrl: "./employee-dashboard.component.html",
  styleUrls: ["./employee-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  currentProjectPageNumber = 1;
  errors: string[] = [];
  currentUser$: Observable<IAppUser>;
  projects$: Observable<IProject[]>;
  loadMoreProjects$: Observable<boolean>;

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private readonly employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.employeeService.pagedProjects$.pipe(
      takeUntil(this.destroy$),
      tap(() => stopLoading(this.isLoadingSubject)),
      catchError((err) => {
        stopLoading(this.isLoadingSubject);
        this.snackbarService.showSnackBar(err);
        this.errors = [...this.errors, err];
        return EMPTY;
      })
    );

    this.currentUser$ = this.authService.currentUser$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.errors = [...this.errors, err];
        return EMPTY;
      })
    );

    this.loadMoreProjects$ = this.employeeService.loadMoreProjects$.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.errors = [...this.errors, err];
        return EMPTY;
      })
    );
  }

  trackByFn(_: any, project: IProject): number {
    return project.id;
  }

  loadMoreProjects(): void {
    this.currentProjectPageNumber++;
    this.employeeService.changeProjectPageNumber(this.currentProjectPageNumber);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isLoadingSubject.complete();
  }
}
