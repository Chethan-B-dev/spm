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
  RESOLVED = "RESOLVED",
}

export interface IssueStatistics {
  [status: string]: number;
}

export const IssueStatusOptions = [...Object.keys(IssueStatus)];

export function getIssueStatistics(issues: IIssue[]): IssueStatistics {
  const issueStatistics: IssueStatistics = {
    [IssueStatus.UNRESOLVED]: 0,
    [IssueStatus.RESOLVED]: 0,
  };
  issues.forEach((issue) => (issueStatistics[issue.status] += 1));
  return issueStatistics;
}

export function getIssueProgress(issues: IIssue[]): number {
  const resolvedIssues = issues.filter(
    (issue) => issue.status === IssueStatus.RESOLVED
  ).length;
  return ((resolvedIssues / issues.length) * 100) | 0;
}
