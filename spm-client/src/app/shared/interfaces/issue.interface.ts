import { IProject } from "./project.interface";
import { IAppUser } from "./user.interface";

export interface IIssue {
  id: number;
  summary: string;
  project: IProject;
  user: IAppUser;
  createdDate: Date;
  status: IssueStatus;
}

export enum IssueStatus {
  UNRESOLVED = "UNRESOLVED",
  VIEWED = "VIEWED",
  RESOLVED = "RESOLVED",
}
