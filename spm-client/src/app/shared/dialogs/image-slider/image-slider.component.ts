import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Subject } from "rxjs";
import { EditProjectComponent } from "src/app/manager/dialogs/edit-project/edit-project.component";
import { IProject } from "../../interfaces/project.interface";

@Component({
  selector: "app-image-slider",
  templateUrl: "./image-slider.component.html",
  styleUrls: ["./image-slider.component.scss"],
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  project: IProject;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA) project
  ) {
    this.project = project;
  }

  parseFiles(files: string): string[] {
    return JSON.parse(files);
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.dialogRef.close();
  }
}
