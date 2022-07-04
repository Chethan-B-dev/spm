import { IProject } from "./project.interface";
import { ITodo } from "./todo.interface";
import { IAppUser } from "./user.interface";

export interface ITask {
  id: number;
  name: string;
  description: string;
  project?: IProject;
  createdDate: Date;
  completedDate?: Date;
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

export const userTasks = [...Object.keys(TaskStatus)];

export function getTaskStatistics(tasks: ITask[]): TaskStatistics {
  const taskStatistics = TaskStatusOptions.reduce((stats, status) => {
    stats[status] = 0;
    return stats;
  }, {} as TaskStatistics);
  tasks.forEach((task) => (taskStatistics[task.status] += 1));
  return taskStatistics;
}

export const TaskStatusOptions = [...Object.keys(TaskStatus)];

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export const TaskPriorityOptions = [...Object.keys(TaskPriority)];
export interface TaskPriorityStatistics {
  [priority: string]: number;
}

export const sortTasksByPriority = (a: ITask, b: ITask) =>
  TaskPriorityOptions.findIndex((priority) => priority === b.priority) -
  TaskPriorityOptions.findIndex((priority) => priority === a.priority);
