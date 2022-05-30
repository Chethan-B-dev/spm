// angular
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

// rxjs
import { combineLatest, EMPTY, Observable, Subject } from "rxjs";
import { catchError, map, switchMap, takeUntil, tap } from "rxjs/operators";

// services
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import { ITask } from "src/app/shared/interfaces/task.interface";

@Component({
  selector: "app-manager-project-detail",
  templateUrl: "./manager-project-detail.component.html",
  styleUrls: ["./manager-project-detail.component.scss"],
})
export class ManagerProjectDetailComponent implements OnInit, OnDestroy {
  defaultTaskCategory: string = "ALL";
  projectId: number;
  project$: Observable<IProject>;
  tasks$: Observable<ITask[]>;
  private readonly destroy$ = new Subject();
  showIssues: boolean = false;
  @ViewChild("scrollHere", { static: false }) issuesContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  onTaskCategoryChange(selectedTaskCategory: string): void {
    this.managerService.selectTaskCategory(selectedTaskCategory);
  }

  toggleShowIssues(): void {
    this.showIssues = !this.showIssues;
    this.issuesContainer.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = +params.get("id");
      // this.managerService.setProjectId(this.projectId);
    });

    // ! we are refreshing in case we update project information
    this.project$ = this.managerService.refresh$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.managerService.getProjectById(this.projectId)),
      tap((project) => this.managerService.setProject(project)),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );

    // this.project$ = this.managerService.selectedSingleProject$.pipe(
    //   takeUntil(this.destroy$),
    //   catchError((err) => {
    //     this.snackbarService.showSnackBar(err);
    //     return EMPTY;
    //   })
    // );

    // todo: add pagination to this stream and scan to add more elements
    this.tasks$ = combineLatest(
      this.managerService.tasksWithAdd$,
      this.managerService.taskCategorySelectedAction$
    ).pipe(
      takeUntil(this.destroy$),
      map(([tasks, selectedTaskCategory]) =>
        selectedTaskCategory === "ALL"
          ? tasks
          : tasks.filter((task) => task.status === selectedTaskCategory)
      ),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToTaskDetail(taskId: number): void {
    this.router.navigate(["task-detail", taskId]);
  }
}
