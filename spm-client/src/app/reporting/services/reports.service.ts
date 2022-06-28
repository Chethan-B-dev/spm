// angular
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
// rxjs
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject,
} from "rxjs";
import {
  catchError,
  concatMap,
  map,
  scan,
  shareReplay,
  switchMap,
  tap,
} from "rxjs/operators";
import { IIssue } from "src/app/shared/interfaces/issue.interface";
import { IPagedData } from "src/app/shared/interfaces/pagination.interface";
// interfaces
import { IProject, ProjectStatus } from "src/app/shared/interfaces/project.interface";
import {
  ITask,
  ITaskRequestDTO,
  TaskPriority,
  TaskPriorityOptions,
  TaskPriorityStatistics,
  TaskStatistics,
  TaskStatus,
  userTasks,
} from "src/app/shared/interfaces/task.interface";
import { getTodoStatistics, ITodo, TodoStatus } from "src/app/shared/interfaces/todo.interface";
import { IAppUser, UserDesignation, UserDesignations, UserDesignationStatistics, UserRole, UserStatus } from "src/app/shared/interfaces/user.interface";
import {
  DataType,
  ISearchData,
  ISearchGroup,
  ISearchResult,
} from "src/app/shared/utility/common";
// utility
import { handleError } from "src/app/shared/utility/error";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

// project: IProject = {"id":13,"manager":{"id":32,"email":"test@test2.com","username":"test2","role":UserRole.MANAGER,"phone":null,"status":UserStatus.VERIFIED},"name":"new p2","fromDate":new Date(),"toDate":new Date(),"status":ProjectStatus.IN_PROGRESS,"description":"test project 2","users":[{"id":30,"email":"test@test1.com","username":"test1","role":UserRole.EMPLOYEE,"phone":null,"status":UserStatus.VERIFIED}],"tasks":[{"id":1,"name":"testt1","description":"dsafdfsfsdfsdff","status":TaskStatus.IN_PROGRESS,"createdDate":new Date(),"deadLine":new Date(),"priority":TaskPriority.MEDIUM,"user":{"id":30,"email":"test@test1.com","username":"test1","role":UserRole.EMPLOYEE,"phone":null,"status":UserStatus.VERIFIED},"todos":[{"id":3,"name":"dsfsddsfs","status":TodoStatus.IN_PROGRESS,"createdOn":new Date()}]}],"issues":[]}




  // Reporting Each Project Progress

  // Data for Donut Chart
  // All users count
  // Developers,testers,QA and Devops count

  // Data for Area Chart
  // Total days assigned for project: No of days between start date and end date
  // Time stamps of all tasks and todo's (Start date and deadline) and calculate the total completion % on each day for all the days within the deadline

  // Data for Pie chart
  // Name employee details
  // each employee contribution % based on tasks, todo's

  // Data for bar graph
  // All tasks names
  // Each task progress(ToDo, In progress and Done) count.

  getUserDesignationStatistics(project: IProject) {
    const userDesignationStats: UserDesignationStatistics = {
      [UserDesignation.DEVELOPER]: 0,
      [UserDesignation.TESTER]: 0,
      [UserDesignation.DEVELOPER]: 0,
    };
    UserDesignations.forEach((designation) => {
      userDesignationStats[designation] = project.users.filter(
        (user) => user.designation === designation
      ).length;
    });
    return userDesignationStats;
}


getTasksPriorityDetails(tasks: ITask[]) {
  const taskPriorityStatistics: TaskPriorityStatistics ={
    [TaskPriority.LOW]: 0,
    [TaskPriority.MEDIUM]: 0,
    [TaskPriority.HIGH]: 0
  }

  tasks.forEach(task => taskPriorityStatistics[task.priority] += 1)
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
  const toDate = project.toDate;
  var loop = new Date(fromDate);
  while(loop <= toDate){
  let  no_of_Tasks = 0;
   project.tasks.forEach(task => {
      if (task.completedDate.toLocaleDateString() === loop.toLocaleDateString()) no_of_Tasks += 1;
   })
   res.push({x: loop.toDateString(), y:no_of_Tasks})
   var newDate = loop.setDate(loop.getDate() + 1);
   loop = new Date(newDate);
  }
  // console.log(res);
  return res;
}

getAllTaskStatusCount(project: IProject): any {
  const result = []
  const todo = [];
  const in_progress = []
  const done = [];
  const names = [];
  let max = 0;
  project.tasks.forEach(task => {
    const stats = getTodoStatistics(task.todos)
    console.log(stats)
    // result.push(y: task.name, y: todoStats)
    todo.push(stats[TodoStatus.TO_DO])
    in_progress.push(stats[TodoStatus.IN_PROGRESS])
    done.push(stats[TodoStatus.DONE])
    max = Math.max(max, task.todos.length);
    names.push(task.name);
  })
  return {todo, in_progress, done, max, names}
}


getProjectOrgChart(project: IProject): UserDesignationStatistics {
  const userDesgStats: UserDesignationStatistics = {
    [UserDesignation.TESTER] : [],
    [UserDesignation.DEVELOPER] : [],
    [UserDesignation.DEVOPS] : [],
  }
  project.users.forEach(({username,email,designation}) =>{
    userDesgStats[designation].push({username,email})
  })
  return userDesgStats;

}

  constructor(private http: HttpClient) { }




}
