import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { EMPTY, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private readonly destroy$ = new Subject();

  toppingList: string[] = ["hello", "world"];
  createProjectForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private managerService: ManagerService,
    private snackBar: MatSnackBar
  ) {}

  createProject(): void {
    let projectName: string = this.createProjectForm.value.name;
    let projectDescription: string = this.createProjectForm.value.description;
    let projectDeadLine: Date = this.createProjectForm.value.toDate;
    this.managerService
      .createProject(projectName, projectDescription, projectDeadLine)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          err.error instanceof ErrorEvent
            ? this.showSnackBar(JSON.stringify(err.error.message))
            : this.showSnackBar(err.message);
          this.errorMessageSubject.next(err.message);
          return EMPTY;
        })
      )
      .subscribe((project) => {
        this.showSnackBar("Project has been created");
        this.close();
      });
  }

  private showSnackBar(message: string, duration?: number): void {
    this.snackBar.open(message, "Close", {
      duration: duration ? duration : 3000,
    });
  }

  ngOnInit(): void {
    this.createProjectForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      toDate: ["", Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.dialogRef.close();
  }
}
