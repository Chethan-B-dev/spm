import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TaskStatus } from "./../../shared/interfaces/task.interface";

import { combineLatest, EMPTY, Observable, Subject } from "rxjs";
import {
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs/operators";

import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

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
  defaultTaskCategory = TaskStatus.ALL;
  showIssues = false;
  project$: Observable<IProject>;
  tasks$: Observable<ITask[]>;
  issues$: Observable<IIssue[]>;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
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
    const projectId$ = this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map((params) => +params.get("id"))
    );

    this.project$ = this.managerService.refresh$.pipe(
      withLatestFrom(projectId$),
      takeUntil(this.destroy$),
      switchMap(([_, projectId]) =>
        this.managerService.getProjectById(projectId)
      ),
      tap((project) => this.managerService.setProject(project)),
      catchError(() => EMPTY)
    );

    this.managerService.selectTaskCategory(this.defaultTaskCategory);

    this.tasks$ = combineLatest(
      this.managerService.tasksWithAdd$,
      this.managerService.taskCategorySelectedAction$
    ).pipe(
      takeUntil(this.destroy$),
      map(this.filterTasksByStatusAndSortByPriority),
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

  getIssueKey(projectName: string, issueId: number): string {
    return projectName.substring(0, 4) + "-" + issueId;
  }

  sortIssues(issues: IIssue[]): IIssue[] {
    return issues.sort(sortIssuesByPriority);
  }

  private filterTasksByStatusAndSortByPriority([tasks, taskStatus]: [
    ITask[],
    string
  ]) {
    const filteredTasks =
      taskStatus === TaskStatus.ALL
        ? tasks
        : tasks.filter((task) => task.status === taskStatus);
    return filteredTasks.sort(sortTasksByPriority);
  }
}
