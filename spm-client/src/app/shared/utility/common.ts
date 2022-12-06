import { IComment } from "./../interfaces/issue.interface";
import { IIssue } from "../interfaces/issue.interface";
import { INotification } from "../interfaces/notification.interface";
import { IProject } from "../interfaces/project.interface";
import { ITask } from "../interfaces/task.interface";
import { ITodo } from "../interfaces/todo.interface";
import { IAppUser } from "../interfaces/user.interface";

export interface IStringMap<T> {
  [key: string]: T;
}

export enum DataType {
  TODO = "TODO",
  USER = "USER",
  PROJECT = "PROJECT",
  TASK = "TASK",
  ISSUE = "ISSUE",
  COMMENT = "COMMENT",
}

export type ProjectData =
  | IProject
  | ITodo
  | IAppUser
  | ITask
  | IIssue
  | IComment;

export interface DeleteData {
  deleteType: DataType;
  id: number;
}

export enum ICrudOperation {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface ICrudAction<T> {
  data: T;
  action: ICrudOperation;
}

export interface ISearchResult {
  projects: IProject[];
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

export function myTitleCase(string: string): string {
  const splitString = string.toLowerCase().split(" ");
  for (let i = 0; i < splitString.length; i++) {
    const firstLetter = splitString[i].charAt(0).toUpperCase();
    splitString[i] = firstLetter + splitString[i].substring(1);
  }
  return splitString.join(" ");
}

export function mapSearchResults(searchResults: ISearchResult): ISearchGroup[] {
  const dataTypesNameKey: IStringMap<string> = {
    [DataType.PROJECT]: "name",
    [DataType.USER]: "username",
    [DataType.TASK]: "name",
    [DataType.TODO]: "name",
    [DataType.ISSUE]: "summary",
  };
  return Object.entries(searchResults).map(([key, values]) => {
    const actualDataType = key.substring(0, key.length - 1).toUpperCase();
    const nameKey = dataTypesNameKey[actualDataType];
    return {
      type: actualDataType,
      data: values.map((data: ProjectData) => ({
        name: data[nameKey] as string,
        id: data.id,
      })),
    } as ISearchGroup;
  });
}

export function sendProjectApproachingDeadlineNotification(
  data: IProject | IProject[]
): void {
  if (data instanceof Array) {
    data.forEach((project) => sendProjectDeadlineNotification(project));
  } else {
    sendProjectDeadlineNotification(data);
  }
}

export function sendTaskApproachingDeadlineNotification(
  data: ITask | ITask[]
): void {
  if (data instanceof Array) {
    data.forEach((task) => sendTaskDeadlineNotification(task));
  } else {
    sendTaskDeadlineNotification(data);
  }
}

/**
 * this function returns the difference between two dates in days
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

export function showError(): (err: string) => void {
  return (err: string) => this.snackbarService.showSnackBar(err);
}

function sendProjectDeadlineNotification(project: IProject): void {
  const diffTime = Math.abs(+new Date() - +new Date(project.toDate));
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

function sendTaskDeadlineNotification(task: ITask): void {
  const diffTime = Math.abs(+new Date() - +new Date(task.deadLine));
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
