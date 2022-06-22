import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import {
  IComment,
  IIssue,
  IssueStatus,
  IUpdateIssueDTO,
} from "src/app/shared/interfaces/issue.interface";
import { IAppUser, UserRole } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { SharedService } from "src/app/shared/shared.service";

@Component({
  selector: "app-employee-issue-detail",
  templateUrl: "./employee-issue-detail.component.html",
  styleUrls: ["./employee-issue-detail.component.scss"],
})
export class EmployeeIssueDetailComponent implements OnInit, OnDestroy {
  addCommentForm: FormGroup;
  issueId: number;
  issue$: Observable<IIssue>;
  comments$: Observable<IComment[]>;
  currentUser: IAppUser = this.authService.currentUser;
  private readonly destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly authService: AuthService,
    // todo: move resolve issue to manger service
    private readonly managerService: ManagerService,
    private readonly snackbarService: SnackbarService,
    private readonly sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.addCommentForm = this.fb.group({
      comment: ["", Validators.required],
    });
    this.route.paramMap.subscribe(
      (paramMap) => (this.issueId = +paramMap.get("id"))
    );
    this.issue$ = this.sharedService.refresh$.pipe(
      switchMap(() => this.sharedService.getIssueById(this.issueId)),
      takeUntil(this.destroy$),
      catchError((err) => {
        this.snackbarService.showSnackBar(err);
        return EMPTY;
      })
    );
    this.comments$ = this.sharedService.refresh$.pipe(
      switchMap(() => this.sharedService.getAllComments(this.issueId)),
      takeUntil(this.destroy$),
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

  addComment(issueId: number): void {
    this.sharedService
      .addComment(
        this.addCommentForm.value.comment,
        this.currentUser.id,
        issueId
      )
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar(`comment added`);
        this.addCommentForm.reset();
      });
  }

  deleteComment(commentId: number): void {
    this.sharedService
      .deleteComment(commentId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((res: boolean) => {
        if (res) this.snackbarService.showSnackBar(`comment has been deleted`);
      });
  }

  resolveIssue(issue: IIssue): void {
    const updateIssueDTO: IUpdateIssueDTO = {
      summary: issue.summary,
      status: IssueStatus.RESOLVED,
    };
    this.sharedService
      .updateIssue(updateIssueDTO, issue.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe((_) => {
        this.snackbarService.showSnackBar(`issue has been resolved`);
      });
  }

  canResolve(issue: IIssue): boolean {
    return (
      this.currentUser.role === UserRole.MANAGER &&
      issue.status === IssueStatus.UNRESOLVED
    );
  }

  isResolved(issue: IIssue): boolean {
    return issue.status === IssueStatus.RESOLVED;
  }

  isMyIssue(comment: IComment): boolean {
    return comment.user.id === this.currentUser.id;
  }
}
