import { Component, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CreateTaskComponent } from "src/app/manager/dialogs/create-task/create-task.component";

@Component({
  selector: "app-project-card",
  templateUrl: "./project-card.component.html",
  styleUrls: ["./project-card.component.scss"],
})
export class ProjectCardComponent implements OnInit {
  createdDate: Date = new Date();
  name: string = "testProject";
  deadLine: Date = new Date();
  toppingList: string[] = ["hello", "world", "hwo", "are", "you"];
  @Input() showAddTask: boolean = false;
  @Input() showBackButton: boolean = false;
  @Input() showAddEmps: boolean = false;
  @Input() showIssueStats: boolean = false;
  @Input() showViewDetailsButton: boolean = true;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    let currentElement = this.el.nativeElement;
  }

  goBack(): void {
    window.history.go(-1);
  }

  openCreateTaskDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = "400px";

    dialogConfig.data = {
      projectName: this.name,
    };

    // this.dialog.open(CreateTaskComponent, dialogConfig);

    const dialogRef = this.dialog.open(CreateTaskComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .subscribe((data) => console.log("Dialog output:", data));
  }
}
