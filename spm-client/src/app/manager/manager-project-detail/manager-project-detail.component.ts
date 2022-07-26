// angular
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";

// rxjs
import { combineLatest, EMPTY, Observable, Subject } from "rxjs";
import { catchError, map, switchMap, takeUntil, tap } from "rxjs/operators";

// services
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

// interfaces
import {
  IIssue,
  sortIssuesByPriority,
} from "src/app/shared/interfaces/issue.interface";
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  ITask,
  sortTasksByPriority,
} from "src/app/shared/interfaces/task.interface";

@Component({
  selector: "app-manager-project-detail",
  templateUrl: "./manager-project-detail.component.html",
  styleUrls: ["./manager-project-detail.component.scss"],
})
export class ManagerProjectDetailComponent implements OnInit, OnDestroy {
  defaultTaskCategory = "ALL";
  showIssues = false;
  project$: Observable<IProject>;
  tasks$: Observable<ITask[]>;
  issues$: Observable<IIssue[]>;
  private projectId: number;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService
  ) {}

  onTaskCategoryChange(selectedTaskCategory: string): void {
    this.managerService.selectTaskCategory(selectedTaskCategory);
  }

  toggleShowIssues(): void {
    this.showIssues = !this.showIssues;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = +params.get("id");
      this.managerService.refresh();
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

    this.managerService.selectTaskCategory(this.defaultTaskCategory);

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
      map((tasks) => tasks.sort(sortTasksByPriority)),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  getIssueKey(projectName: string, issueId: number): string {
    return projectName.substring(0, 4) + "-" + issueId;
  }

  sortIssues(issues: IIssue[]): IIssue[] {
    return issues.sort(sortIssuesByPriority);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
