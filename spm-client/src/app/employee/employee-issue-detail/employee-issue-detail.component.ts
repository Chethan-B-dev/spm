import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { ManagerService } from "src/app/manager/services/manager.service";
import { ConfirmDeleteComponent } from "src/app/shared/dialogs/confirm-delete/confirm-delete.component";
import {
  IComment,
  IIssue,
  IssueStatus,
  IUpdateIssueDTO,
} from "src/app/shared/interfaces/issue.interface";
import { IAppUser, UserRole } from "src/app/shared/interfaces/user.interface";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { SharedService } from "src/app/shared/shared.service";
import { DataType, DeleteData } from "src/app/shared/utility/common";

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
    public dialog: MatDialog,
    private readonly authService: AuthService,
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
      .subscribe(() => {
        this.snackbarService.showSnackBar(`comment added`);
        this.addCommentForm.reset();
      });
  }

  deleteComment(commentId: number): void {
    const deleteData: DeleteData = {
      deleteType: DataType.COMMENT,
      id: commentId,
    };
    this.dialog.open(ConfirmDeleteComponent, {
      data: deleteData,
    });
  }

  resolveIssue(issue: IIssue): void {
    const updateIssueDTO: IUpdateIssueDTO = {
      summary: issue.summary,
      status: IssueStatus.RESOLVED,
    };
    this.managerService
      .updateIssue(updateIssueDTO, issue.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.snackbarService.showSnackBar(err);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.snackbarService.showSnackBar(`issue has been resolved`);
      });
  }

  canResolve(issue: IIssue): boolean {
    return (
      this.currentUser.role === UserRole.MANAGER &&
      issue.status === IssueStatus.UNRESOLVED
    );
  }

  goBack(): void {
    window.history.go(-1);
  }

  isResolved(issue: IIssue): boolean {
    return issue.status === IssueStatus.RESOLVED;
  }

  isMyComment(comment: IComment): boolean {
    return comment.user.id === this.currentUser.id;
  }
}
