import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss']
})
export class CreateIssueComponent implements OnInit {
  createIssueForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateIssueComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

     }

  ngOnInit() {

  }

  createIssue() {
    console.log(this.createIssueForm.value);
  }

  close() {
    this.dialogRef.close();
  }



}
