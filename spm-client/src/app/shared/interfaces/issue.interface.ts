import { IProject } from "./project.interface";
import { IAppUser } from "./user.interface";

export interface IIssue {
  id: number;
  summary: string;
  image?: string;
  project?: IProject;
  user: IAppUser;
  createdDate: Date;
  resolvedDate?: Date;
  status: IssueStatus;
  priority: IssuePriority;
}

export interface IComment {
  id: number;
  user: IAppUser;
  comment: string;
  issue?: IIssue;
  createdDateTime: Date;
}

export interface IUpdateIssueDTO {
  summary: string;
  status: IssueStatus;
}

export interface ICreateIssueDTO {
  summary: string;
  priority: IssuePriority;
  image: string;
}

export enum IssueStatus {
  UNRESOLVED = "UNRESOLVED",
  RESOLVED = "RESOLVED",
}

export enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface IssueStatistics {
  [status: string]: number;
}

export const IssueStatusOptions = [...Object.keys(IssueStatus)];

export const IssuePriorityOptions = [...Object.keys(IssuePriority)];

export function getIssueStatistics(issues: IIssue[]): IssueStatistics {
  const issueStatistics = IssueStatusOptions.reduce((stats, status) => {
    stats[status] = 0;
    return stats;
  }, {} as IssueStatistics);
  issues.forEach((issue) => (issueStatistics[issue.status] += 1));
  return issueStatistics;
}

export function getIssueProgress(issues: IIssue[]): number {
  const resolvedIssues = issues.filter(
    (issue) => issue.status === IssueStatus.RESOLVED
  ).length;
  return ((resolvedIssues / issues.length) * 100) | 0;
}

export const sortIssuesByPriority = (a: IIssue, b: IIssue) =>
IssuePriorityOptions.findIndex((priority) => priority === b.priority) -
IssuePriorityOptions.findIndex((priority) => priority === a.priority);
