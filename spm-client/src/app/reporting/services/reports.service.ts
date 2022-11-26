import {
  TaskPriorityOptions,
  TaskStatusOptions,
} from "./../../shared/interfaces/task.interface";
// angular
import { Injectable } from "@angular/core";
// rxjs
// interfaces
import { IProject } from "src/app/shared/interfaces/project.interface";
import {
  isBacklogTask,
  ITask,
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
  UserDesignations,
  UserDesignationStatistics,
  UserDesignationStatisticsCount,
} from "src/app/shared/interfaces/user.interface";
import { differenceBetweenTwoDays } from "src/app/shared/utility/common";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  getTasksPriorityDetails(tasks: ITask[]) {
    const taskPriorityStatistics = TaskPriorityOptions.reduce(
      (stats, priority) => {
        stats[priority] = 0;
        return stats;
      },
      {} as TaskPriorityStatistics
    );

    tasks.forEach((task) => (taskPriorityStatistics[task.priority] += 1));
    return taskPriorityStatistics;
  }

  getProjectTaskStatistics(tasks: ITask[]): TaskStatistics {
    const taskStatistics = TaskStatusOptions.reduce((stats, status) => {
      stats[status] = 0;
      return stats;
    }, {} as TaskStatistics);

    tasks.forEach((task) => (taskStatistics[task.status] += 1));
    return taskStatistics;
  }

  getAllTasksAreaProgress(project: IProject): any[] {
    const result: { x: string; y: number }[] = [];
    const fromDate = project.fromDate;
    const toDate = new Date(this.getToDate(project));
    var loop = new Date(fromDate);
    while (loop <= toDate) {
      const numberOfTasks = project.tasks.reduce((count, task) => {
        if (
          new Date(task.completedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        ) {
          return count + 1;
        }
        return count;
      }, 0);

      result.push({ x: loop.toDateString(), y: numberOfTasks });
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return result;
  }

  getIdealBurn(project: IProject) {
    return this.getIdealBurnData(project);
  }

  getIdealBurnData(project: IProject) {
    const countOfTasks = project.tasks.length;
    const days = differenceBetweenTwoDays(project.fromDate, project.toDate);
    const diff = countOfTasks / days;
    let actual = countOfTasks;
    const result = [actual];
    for (let i = 0; i < days; i++) {
      actual -= diff;
      result.push(actual);
    }
    return result;
  }

  getIdealBurnDataProject(project: IProject) {
    const totalCount = project.tasks.length + project.issues.length;
    const days = differenceBetweenTwoDays(project.fromDate, project.toDate);
    const diff = totalCount / days;
    let actual = totalCount;
    const result = [actual];
    for (let i = 0; i < days; i++) {
      actual -= diff;
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
      const no_of_tasks = project.tasks.reduce((count, task) => {
        if (
          new Date(task.completedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        ) {
          return count + 1;
        }
        return count;
      }, 0);
      actual -= no_of_tasks;
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
      actual -= no_of_Tasks;
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
      const numberOfTasks = project.issues.reduce((numberOfTasks, issue) => {
        if (
          new Date(issue.resolvedDate).toLocaleDateString() ===
          loop.toLocaleDateString()
        ) {
          return numberOfTasks + 1;
        }
        return numberOfTasks;
      }, 0);
      actual -= numberOfTasks;
      res.push({ x: loop.toDateString(), y: actual });
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return res;
  }

  getAllTaskStatusCount(project: IProject): any {
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
    return project.tasks.reduce((totalTodos, task) => {
      if (task.user.id === user.id) return totalTodos + task.todos.length;
      return totalTodos;
    }, 0);
  }

  getEmployeeRank(project: IProject, user: IAppUser): number {
    const userRankings = project.users.sort((userA, userB) => {
      let completedTasksOfA = 0;
      let completedTasksOfB = 0;

      let daysTakenByA = 0;
      let daysTakenByB = 0;

      let countOfTodosOfA = 0;
      let countOfTodosOfB = 0;

      project.tasks.forEach((task: ITask) => {
        if (task.user.id === userA.id) {
          if (task.status === TaskStatus.COMPLETED) {
            completedTasksOfA++;
            daysTakenByA += differenceBetweenTwoDays(
              task.createdDate,
              task.completedDate
            );
          }
          countOfTodosOfA += task.todos.length;
        }

        if (task.user.id === userB.id) {
          if (task.status === TaskStatus.COMPLETED) {
            completedTasksOfB++;
            daysTakenByB += differenceBetweenTwoDays(
              task.createdDate,
              task.completedDate
            );
          }
          countOfTodosOfB += task.todos.length;
        }
      });

      if (completedTasksOfA === completedTasksOfB) {
        // rank them based on the total todos he was assigned
        if (countOfTodosOfA === countOfTodosOfB) {
          // rank them based on number of days taken to complete tasks
          return daysTakenByB - daysTakenByA;
        }
        return countOfTodosOfB - countOfTodosOfA;
      }

      // rank them based on number of tasks completed
      return completedTasksOfB - completedTasksOfA;
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
    const userDesignationStats: UserDesignationStatistics = {
      [UserDesignation.TESTER]: [],
      [UserDesignation.DEVELOPER]: [],
      [UserDesignation.DEVOPS]: [],
    };
    project.users.forEach(({ username, email, designation }) => {
      userDesignationStats[designation].push({ username, email });
    });
    return userDesignationStats;
  }

  getOrgChartData(project: IProject): Array<Object[]> {
    const result = [] as Array<Object[]>;
    const userDesignationStats: UserDesignationNameStatistics = {
      [UserDesignation.TESTER]: [],
      [UserDesignation.DEVELOPER]: [],
      [UserDesignation.DEVOPS]: [],
    };
    project.users.forEach(({ username, designation }) => {
      userDesignationStats[designation].push(username);
    });
    const developers = userDesignationStats[UserDesignation.DEVELOPER];
    for (let i = 0; i < developers.length - 1; i++) {
      result.push([developers[i], developers[i + 1]]);
    }
    const testers = userDesignationStats[UserDesignation.TESTER];
    for (let i = 0; i < testers.length - 1; i++) {
      result.push([testers[i], testers[i + 1]]);
    }
    const devops = userDesignationStats[UserDesignation.DEVOPS];
    for (let i = 0; i < devops.length - 1; i++) {
      result.push([devops[i], devops[i + 1]]);
    }
    return result;
  }

  getProjectUserDesignationCount(
    project: IProject
  ): UserDesignationStatisticsCount {
    const userDesignationCount = UserDesignations.reduce(
      (stats, designation) => {
        stats[designation] = 0;
        return stats;
      },
      {} as UserDesignationStatisticsCount
    );
    project.users.forEach((user) => {
      userDesignationCount[user.designation] += 1;
    });
    return userDesignationCount;
  }

  private getToDate(project: IProject): Date {
    let toDate = project.toDate;
    project.tasks.forEach((task) => {
      if (task.completedDate > toDate) {
        toDate = task.completedDate;
      }
    });
    return toDate;
  }
}
