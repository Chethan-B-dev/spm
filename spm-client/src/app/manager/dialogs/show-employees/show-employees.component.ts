import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  TaskStatistics,
  TaskStatus,
} from "src/app/shared/interfaces/task.interface";
import { IAppUserRanking } from "src/app/shared/interfaces/user.interface";

@Component({
  selector: "app-show-employees",
  templateUrl: "./show-employees.component.html",
  styleUrls: ["./show-employees.component.scss"],
})
export class ShowEmployeesComponent implements OnInit {
  project: IProject;
  employeeRankings: IAppUserRanking[];
  constructor(
    @Inject(MAT_DIALOG_DATA) project,
    private dialogRef: MatDialogRef<ShowEmployeesComponent>
  ) {
    this.project = project;
  }

  ngOnInit(): void {
    this.employeeRankings = this.project.users
      .map((user) => {
        const taskStatistics: TaskStatistics = {
          [TaskStatus.IN_PROGRESS]: 0,
          [TaskStatus.COMPLETED]: 0,
        };
        const userTasks = this.project.tasks.filter((task) => {
          if (task.user.id === user.id) {
            taskStatistics[task.status] += 1;
            return true;
          }
          return false;
        });
        if (!userTasks.length) return { user, ranking: 0 } as IAppUserRanking;
        return {
          user,
          ranking:
            (taskStatistics[TaskStatus.COMPLETED] / userTasks.length) * 100,
        } as IAppUserRanking;
      })
      .sort((a, b) => b.ranking - a.ranking);
  }

  close(): void {
    this.dialogRef.close();
  }
}
