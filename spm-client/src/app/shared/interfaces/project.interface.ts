import { IIssue } from "./issue.interface";
import { ITask } from "./task.interface";
import { IAppUser } from "./user.interface";

export interface IProject {
  id: number;
  name: string;
  manager: IAppUser;
  fromDate: Date;
  toDate: Date;
  status: ProjectStatus;
  description: string;
  users: IAppUser[];
  tasks: ITask[];
  issues: IIssue[];
}

export enum ProjectStatus {
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETE = "COMPLETE",
}

export const ProjectStatusOptions = [...Object.keys(ProjectStatus)];
