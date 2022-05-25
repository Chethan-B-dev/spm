import { IProject } from "./project.interface";
import { IAppUser } from "./user.interface";

export interface ITask {
  id: number;
  name: string;
  description: string;
  project: IProject;
  createdDate: Date;
  deadLine: Date;
  status: TaskStatus;
  priority: TaskPriority;
  user: IAppUser;
}

export interface ITaskRequestDTO {
  name: string;
  description: string;
  deadLine: Date;
  priority: TaskPriority;
  userId: number;
}

enum TaskStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE",
}

enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
