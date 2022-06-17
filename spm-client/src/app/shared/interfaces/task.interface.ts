import { IProject } from "./project.interface";
import { ITodo } from "./todo.interface";
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
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface TaskStatistics {
  [status: string]: number;
}

export function getTaskStatistics(tasks: ITask[]): TaskStatistics {
  const TaskStatistics: TaskStatistics = {
    [TaskStatus.IN_PROGRESS]: 0,
    [TaskStatus.COMPLETED]: 0,
  };
  tasks.forEach((task) => (TaskStatistics[task.status] += 1));
  return TaskStatistics;
}

export const TaskStatusOptions = [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED];

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
