// angular
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// rxjs
// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  isBacklogTask,
  ITask,
  TaskPriority,
  TaskPriorityStatistics,
  TaskStatistics,
  TaskStatus,
} from "src/app/shared/interfaces/task.interface";
import {
  getTodoStatistics,
  TodoStatus,
} from "src/app/shared/interfaces/todo.interface";
import {
  IAppUser,
  UserDesignation,
  UserDesignationNameStatistics,
  UserDesignationStatistics,
  UserDesignationStatisticsCount,
} from "src/app/shared/interfaces/user.interface";
import { differenceBetweenTwoDays } from "src/app/shared/utility/common";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getTasksPriorityDetails(tasks: ITask[]) {
    const taskPriorityStatistics: TaskPriorityStatistics = {
      [TaskPriority.LOW]: 0,
      [TaskPriority.MEDIUM]: 0,
      [TaskPriority.HIGH]: 0,
    };

    tasks.forEach((task) => (taskPriorityStatistics[task.priority] += 1));
    return taskPriorityStatistics;
  }

  getProjectTaskStatistics(tasks: ITask[]): TaskStatistics {
    const TaskStatistics: TaskStatistics = {
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.COMPLETED]: 0,
    };
    tasks.forEach((task) => (TaskStatistics[task.status] += 1));
    return TaskStatistics;
  }

  getAllTasksAreaProgress(project: IProject): any[] {
    const res = [];
    const fromDate = project.fromDate;
    const toDate = new Date(this.getToDate(project));
    var loop = new Date(fromDate);
    while (loop <= toDate) {
      let no_of_Tasks = 0;
      project.tasks.forEach((task) => {
        if (
          new Date(task.completedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        )
          no_of_Tasks += 1;
      });
      res.push({ x: loop.toDateString(), y: no_of_Tasks });
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return res;
  }

  private getToDate(project: IProject): Date {
    let toDate = project.toDate;
    project.tasks.forEach((task) => {
      if (task.completedDate > toDate) toDate = task.completedDate;
    });
    return toDate;
  }

  getIdealBurn(project: IProject) {
    return this.getIdealBurnData(project);
  }

  getIdealBurnData(project: IProject) {
    let countOfTasks = project.tasks.length;
    const days = differenceBetweenTwoDays(project.fromDate, project.toDate);
    const diff = countOfTasks / days;
    let actual = countOfTasks;
    const result = [actual];
    for (let i = 0; i < days; i++) {
      actual = actual - diff;
      result.push(actual);
    }
    return result;
  }

  getIdealBurnDataProject(project: IProject) {
    let totalCount = project.tasks.length + project.issues.length;
    const days = differenceBetweenTwoDays(project.fromDate, project.toDate);
    const diff = totalCount / days;
    let actual = totalCount;
    const result = [actual];
    for (let i = 0; i < days; i++) {
      actual = actual - diff;
      result.push(actual);
    }
    return result;
  }

  getActualBurnData(project: IProject) {
    const fromDate = project.fromDate;
    const toDate = new Date(this.getToDate(project));
    let actual = project.tasks.length;
    var loop = new Date(fromDate);
    const res = [];
    while (loop <= toDate) {
      let no_of_Tasks = 0;
      project.tasks.forEach((task) => {
        if (
          new Date(task.completedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        ) {
          no_of_Tasks += 1;
        }
      });
      actual = actual - no_of_Tasks;
      res.push({ x: loop.toDateString(), y: actual });
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return res;
  }

  getActualBurnDataProject(project: IProject) {
    const fromDate = project.fromDate;
    const toDate = new Date(this.getToDate(project));
    let actual = project.tasks.length + project.issues.length;
    var loop = new Date(fromDate);
    const res = [];
    while (loop <= toDate) {
      let no_of_Tasks = 0;
      project.tasks.forEach((task) => {
        if (
          new Date(task.completedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        )
          no_of_Tasks += 1;
      });
      project.issues.forEach((issue) => {
        if (
          new Date(issue.resolvedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        )
          no_of_Tasks += 1;
      });
      actual = actual - no_of_Tasks;
      res.push({ x: loop.toDateString(), y: actual });
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return res;
  }

  getActualBurnDataIssues(project: IProject) {
    const fromDate = project.fromDate;
    const toDate = new Date(this.getToDate(project));
    let actual = project.issues.length;
    var loop = new Date(fromDate);
    const res = [];
    while (loop <= toDate) {
      let no_of_Tasks = 0;
      project.issues.forEach((issue) => {
        if (
          new Date(issue.resolvedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        )
          no_of_Tasks += 1;
      });
      actual = actual - no_of_Tasks;
      res.push({ x: loop.toDateString(), y: actual });
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return res;
  }

  getAllTaskStatusCount(project: IProject): any {
    const result = [];
    const todo = [];
    const in_progress = [];
    const done = [];
    const names = [];
    let max = 0;
    project.tasks.forEach((task) => {
      const stats = getTodoStatistics(task.todos);
      todo.push(stats[TodoStatus.TO_DO]);
      in_progress.push(stats[TodoStatus.IN_PROGRESS]);
      done.push(stats[TodoStatus.DONE]);
      max = Math.max(max, task.todos.length);
      names.push(task.name);
    });
    return { todo, in_progress, done, max, names };
  }

  getUserTaskStatistics(project: IProject, user: IAppUser): TaskStatistics {
    const taskStatistics: TaskStatistics = {
      [TaskStatus.COMPLETED]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
    };
    project.tasks.forEach((task) => {
      if (task.user.id === user.id) {
        taskStatistics[task.status] += 1;
      }
    });
    return taskStatistics;
  }

  getTotalTodosOfUser(project: IProject, user: IAppUser): number {
    return project.tasks.reduce((acc, curr: ITask) => {
      if (curr.user.id === user.id) acc += curr.todos.length;
      return acc;
    }, 0);
  }

  getEmployeeRank(project: IProject, user: IAppUser): number {
    const userRankings = project.users.sort((userA, userB) => {
      const tasksCompletedA = project.tasks.filter(
        (task) =>
          task.user.id === userA.id && task.status === TaskStatus.COMPLETED
      ).length;

      const tasksCompletedB = project.tasks.filter(
        (task) =>
          task.user.id === userB.id && task.status === TaskStatus.COMPLETED
      ).length;

      if (tasksCompletedA === tasksCompletedB) {
        // rank them based on the total todos he was assigned
        const totalTodosA = project.tasks
          .filter((task) => task.user.id === userA.id)
          .reduce((total, task) => total + task.todos.length, 0);

        const totalTodosB = project.tasks
          .filter((task) => task.user.id === userB.id)
          .reduce((total, task) => total + task.todos.length, 0);

        return totalTodosB - totalTodosA;
      }

      return tasksCompletedB - tasksCompletedA;
    });
    return userRankings.findIndex((u) => u.id === user.id) + 1;
  }

  getUserPerformanceChart(project: IProject, user: IAppUser) {
    const data = {
      completed_tasks: 0,
      total_tasks: 0,
      backlog_tasks: 0,
      in_progress_tasks: 0,
      issues_raised: 0,
    };
    data["issues_raised"] = project.issues.filter(
      (issue) => issue.user.id === user.id
    ).length;
    data["total_tasks"] = project.tasks.filter(
      (task) => task.user.id === user.id
    ).length;
    project.tasks.forEach((task) => {
      if (task.user.id === user.id) {
        if (isBacklogTask(task)) data["backlog_tasks"] += 1;
        if (task.status === TaskStatus.COMPLETED) data["completed_tasks"] += 1;
        else data["in_progress_tasks"] += 1;
      }
    });
    return data;
  }

  getProjectOrgChart(project: IProject): UserDesignationStatistics {
    const userDesgStats: UserDesignationStatistics = {
      [UserDesignation.TESTER]: [],
      [UserDesignation.DEVELOPER]: [],
      [UserDesignation.DEVOPS]: [],
    };
    project.users.forEach(({ username, email, designation }) => {
      userDesgStats[designation].push({ username, email });
    });
    return userDesgStats;
  }

  getOrgChartData(project: IProject): Array<Object[]> {
    const result = [] as Array<Object[]>;
    const userDesgStats: UserDesignationNameStatistics = {
      [UserDesignation.TESTER]: [],
      [UserDesignation.DEVELOPER]: [],
      [UserDesignation.DEVOPS]: [],
    };
    project.users.forEach(({ username, designation }) => {
      userDesgStats[designation].push(username);
    });
    const developers = userDesgStats[UserDesignation.DEVELOPER];
    for (let i = 0; i < developers.length - 1; i++) {
      result.push([developers[i], developers[i + 1]]);
    }
    const testers = userDesgStats[UserDesignation.TESTER];
    for (let i = 0; i < testers.length - 1; i++) {
      result.push([testers[i], testers[i + 1]]);
    }
    const devops = userDesgStats[UserDesignation.DEVOPS];
    for (let i = 0; i < devops.length - 1; i++) {
      result.push([devops[i], devops[i + 1]]);
    }
    return result;
  }

  getProjectUserDesignationCount(
    project: IProject
  ): UserDesignationStatisticsCount {
    const userDesignationCount: UserDesignationStatisticsCount = {
      [UserDesignation.TESTER]: 0,
      [UserDesignation.DEVELOPER]: 0,
      [UserDesignation.DEVOPS]: 0,
    };
    project.users.forEach(
      (user) => (userDesignationCount[user.designation] += 1)
    );
    return userDesignationCount;
  }
}
