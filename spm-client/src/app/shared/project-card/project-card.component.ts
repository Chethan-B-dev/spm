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
import { ManagerService } from "src/app/manager/services/manager.service";
import { IProject } from "../interfaces/project.interface";
import { IAppUser } from "../interfaces/user.interface";

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
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private readonly destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private managerService: ManagerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.showAddEmps) {
      this.users$ = this.managerService.refresh.pipe(
        switchMap(() =>
          this.managerService.getAllEmployees(this.project.id).pipe()
        ),
        catchError((err) => {
          this.showSnackBar(err);
          this.errorMessageSubject.next(err.message);
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
    this.managerService
      .addEmployees(this.project.id, this.employees)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.showSnackBar(err);
          this.errorMessageSubject.next(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private showSnackBar(message: string, duration?: number) {
    this.snackBar.open(message, "Close", {
      duration: duration ? duration : 3000,
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
}
