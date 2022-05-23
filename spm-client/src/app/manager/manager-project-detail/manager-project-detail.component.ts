import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { IProject } from "src/app/shared/interfaces/project.interface";
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
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  private readonly destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = +params.get("id");
    });

    this.project$ = this.managerService.refresh.pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        "error" in err.error
          ? this.showSnackBar(err.error!.error)
          : this.showSnackBar(err.message);
        this.errorMessageSubject.next(err.message);
        return EMPTY;
      }),
      switchMap(() => this.managerService.getProjectById(this.projectId))
    );
  }

  private showSnackBar(message: string, duration?: number) {
    this.snackBar.open(message, "Close", {
      duration: duration ? duration : 3000,
    });
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
