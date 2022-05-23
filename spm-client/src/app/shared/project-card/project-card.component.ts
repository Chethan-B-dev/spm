import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { EMPTY, Observable, Subject } from "rxjs";
import {
  catchError,
  map,
  mapTo,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { CreateTaskComponent } from "src/app/manager/dialogs/create-task/create-task.component";
import { ShowEmployeesComponent } from "src/app/manager/dialogs/show-employees/show-employees.component";
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "../interfaces/project.interface";
import { IAppUser } from "../interfaces/user.interface";
import { SnackbarService } from "../services/snackbar.service";

@Component({
  selector: "app-project-card",
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.scss"],
})
export class ProjectCardComponent implements OnInit, OnDestroy {
  @Input() project: IProject;
  @Input() showAddTask: boolean = false;
  @Input() showBackButton: boolean = false;
  @Input() showAddEmps: boolean = false;
  @Input() showIssueStats: boolean = false;
  @Input() showViewDetailsButton: boolean = true;
  users$: Observable<IAppUser[]>;
  employees: number[];
  private readonly destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private managerService: ManagerService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    if (this.showAddEmps) {
      this.users$ = this.managerService.refresh.pipe(
        switchMap(() =>
          this.managerService.getAllEmployees(this.project.id).pipe()
        ),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEmployees(): void {
    if (!!!this.employees || this.employees.length === 0) {
      this.snackbarService.showSnackBar("Please add Employees before syncing");
      return;
    }

    this.managerService
      .addEmployees(this.project.id, this.employees)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.snackbarService.showSnackBar("Employees have been added");
        this.employees = [];
      });
  }

  goBack(): void {
    window.history.go(-1);
  }

  openCreateTaskDialog(project: IProject): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = "400px";

    dialogConfig.data = {
      project,
    };

    const dialogRef = this.dialog.open(CreateTaskComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe((data) => console.log("Dialog output:", data));
  }

  openShowEmployeesDialog(employees: IAppUser[]): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = "400px";

    dialogConfig.data = employees;

    const dialogRef = this.dialog.open(ShowEmployeesComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe((data) => console.log("Dialog output:", data));
  }
}
