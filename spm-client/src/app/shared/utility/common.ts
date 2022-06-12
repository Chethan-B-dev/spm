import { IIssue } from "../interfaces/issue.interface";
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
}

export interface DeleteData {
  deleteType: DataType;
  id: number;
}

export interface ISearchResult {
  projects: IProject[];
  users: IAppUser[];
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

export function myTitleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(" ");
}
