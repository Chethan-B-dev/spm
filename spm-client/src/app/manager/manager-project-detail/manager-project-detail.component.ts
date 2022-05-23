import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { IProject } from "src/app/shared/interfaces/project.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { ManagerService } from "../services/manager.service";

@Component({
  selector: "app-manager-project-detail",
  templateUrl: "./manager-project-detail.component.html",
  styleUrls: ["./manager-project-detail.component.scss"],
})
export class ManagerProjectDetailComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  projectId: number;
  selectedFood: string = "dosai guess";
  foods: string[] = ["dosa", "lol"];
  deadLine: Date = new Date();
  project$: Observable<IProject>;
  private readonly destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = +params.get("id");
    });

    this.project$ = this.managerService.refresh.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.managerService.getProjectById(this.projectId)),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToTaskDetail(taskId: number): void {
    console.log("came here");
    this.router.navigate(["task-detail", taskId]);
  }
}
