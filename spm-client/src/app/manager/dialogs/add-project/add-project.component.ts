import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  Subscription,
} from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../../services/manager.service";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  math = Math;
  files: File[] = [];
  project: IProject;
  uploadPercentsSubject = new BehaviorSubject<Observable<number>[]>([]);
  uploadPercents$ = this.uploadPercentsSubject.asObservable();
  disableButton = false;
  done = false;
  createProjectForm: FormGroup;
  private readonly subscriptions = [] as Subscription[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.createProjectForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      toDate: ["", Validators.required],
      images: [""],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  createProject(files: FileList) {
    const projectName: string = this.createProjectForm.value.name;
    const projectDescription: string = this.createProjectForm.value.description;
    const projectDeadLine: Date = this.createProjectForm.value.toDate;

    if (new Date().getTime() > projectDeadLine.getTime()) {
      this.snackbarService.showSnackBar(
        "Project deadline cannot precede current date"
      );
      return;
    }

    this.disableButton = true;

    const projectSubscription = this.addProject(
      projectName,
      projectDescription,
      projectDeadLine
    ).subscribe((project) => {
      this.project = project;
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        this.files.push(files.item(fileIndex));
      }
      this.done = true;
    });

    this.subscriptions.push(projectSubscription);
  }

  onProjectChange(project: IProject): void {
    this.project = project;
  }

  handleError(err: any): void {
    this.snackbarService.showSnackBar(err);
    this.disableButton = false;
    this.done = false;
    this.createProjectForm.reset();
  }

  addProject(
    projectName,
    projectDescription,
    projectDeadLine
  ): Observable<IProject> {
    return this.managerService
      .createProject(projectName, projectDescription, projectDeadLine)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          this.disableButton = false;
          this.done = false;
          return EMPTY;
        })
      );
  }

  close(): void {
    this.dialogRef.close();
  }
}
