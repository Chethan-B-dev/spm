import { IIssue } from "../interfaces/issue.interface";
import { INotification } from "../interfaces/notification.interface";
import { IProject } from "../interfaces/project.interface";
import { ITask } from "../interfaces/task.interface";
import { ITodo } from "../interfaces/todo.interface";
import { IAppUser } from "../interfaces/user.interface";

export enum DataType {
  TODO = "TODO",
  USER = "USER",
  PROJECT = "PROJECT",
  TASK = "TASK",
  ISSUE = "ISSUE",
  COMMENT = "COMMENT",
}

export interface DeleteData {
  deleteType: DataType;
  id: number;
}

export interface ISearchResult {
  projects: IProject[];
  // todo: remove optional param if nikhil refactors searchDTO
  users?: IAppUser[];
  tasks: ITask[];
  issues: IIssue[];
  todos: ITodo[];
}

export interface ISearchData {
  name: string;
  id: number;
}
export interface ISearchGroup {
  type: DataType;
  data: ISearchData[];
}

export interface PieData<T> {
  type: DataType;
  data: T[];
}

export function myTitleCase(string) {
  let splitString = string.toLowerCase().split(" ");
  for (let i = 0; i < splitString.length; i++) {
    splitString[i] =
      splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);
  }
  return splitString.join(" ");
}

export function mapSearchResults(searchResults: ISearchResult): ISearchGroup[] {
  const searchGroups = [] as ISearchGroup[];
  for (const [key, values] of Object.entries(searchResults)) {
    if (!values.length) continue;
    switch (key) {
      case "projects":
        searchGroups.push({
          type: DataType.PROJECT,
          data: values.map((project: IProject): ISearchData => {
            return { name: project.name, id: project.id } as ISearchData;
          }),
        } as ISearchGroup);
        break;
      case "users":
        searchGroups.push({
          type: DataType.USER,
          data: values.map((user: IAppUser): ISearchData => {
            return { name: user.username, id: user.id } as ISearchData;
          }),
        } as ISearchGroup);
        break;
      case "tasks":
        searchGroups.push({
          type: DataType.TASK,
          data: values.map((task: ITask): ISearchData => {
            return { name: task.name, id: task.id } as ISearchData;
          }),
        } as ISearchGroup);
        break;
      case "todos":
        searchGroups.push({
          type: DataType.TODO,
          data: values.map((todo: ITodo): ISearchData => {
            return { name: todo.name, id: todo.id } as ISearchData;
          }),
        } as ISearchGroup);
        break;
      case "issues":
        searchGroups.push({
          type: DataType.ISSUE,
          data: values.map((issue: IIssue): ISearchData => {
            return { name: issue.summary, id: issue.id } as ISearchData;
          }),
        } as ISearchGroup);
        break;
    }
  }
  return searchGroups;
}

export function sendProjectApproachingDeadlineNotification(
  project: IProject
): void {
  const currentDate = new Date();
  const diffTime = Math.abs(+currentDate - +new Date(project.toDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) {
    const notification: INotification = {
      userId: project.manager.id,
      notification: `Project: ${project.name} is approaching deadline, ${diffDays} days left`,
      time: Date.now(),
    };
    this.notificationService.addNotification(notification);
  }
}

export function sendTaskApproachingDeadlineNotification(task: ITask): void {
  const currentDate = new Date();
  const diffTime = Math.abs(+currentDate - +new Date(task.deadLine));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) {
    const notification: INotification = {
      userId: task.user.id,
      notification: `Task: ${task.name} is approaching deadline, ${diffDays} days left`,
      time: Date.now(),
    };
    this.notificationService.addNotification(notification);
  }
}
/**
 * this function returns the difference between two daytes in days
 * @param fromDate
 * @param toDate
 */
export function differenceBetweenTwoDays(fromDate: Date, toDate: Date): number {
  const diff = new Date(toDate).valueOf() - new Date(fromDate).valueOf();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export function goBack(): void {
  window.history.go(-1);
}
