import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: ["./create-task.component.scss"],
})
export class CreateTaskComponent implements OnInit {
  createTaskForm: FormGroup;
  projectName: string;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) data
  )
   {
    this.projectName = data.projectName;
  }

  ngOnInit() {
    this.createTaskForm = this.fb.group({
      taskName: "",
      taskDescription: "",
      taskDeadLine: "",
      taskEmployee: "",
      taskPriority: "",
    });
  }

  createTask() {
    console.log(this.createTaskForm.value);
  }

  close() {
    this.dialogRef.close();
  }
}
