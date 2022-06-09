import { IProject } from "./project.interface";
import { ITodo, TodoStatus } from "./todo.interface";
import { IAppUser } from "./user.interface";

export interface ITask {
  id: number;
  name: string;
  description: string;
  project?: IProject;
  createdDate: Date;
  deadLine: Date;
  status: TaskStatus;
  priority: TaskPriority;
  user: IAppUser;
  todos: ITodo[];
}

export interface ITaskRequestDTO {
  name: string;
  description: string;
  deadLine: Date;
  priority: TaskPriority;
  userId: number;
}

export enum TaskStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
