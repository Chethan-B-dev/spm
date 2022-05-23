import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { IProject } from "src/app/shared/interfaces/project.interface";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: ["./create-task.component.scss"],
})
export class CreateTaskComponent implements OnInit {
  createTaskForm: FormGroup;
  project: IProject;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.project = data.project;
  }

  ngOnInit() {
    this.createTaskForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      deadLine: ["", Validators.required],
      employee: ["", Validators.required],
      priority: ["", Validators.required],
    });
  }

  createTask() {
    console.log(this.createTaskForm.value);
  }

  close() {
    this.dialogRef.close();
  }
}
