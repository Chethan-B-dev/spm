import { IssueStatus, IssueType, IssuePriority } from "./issue-status";

export class JLane {
  id: IssueStatus;
  title: string;
  issues: JIssue[];
}

export interface JIssue {
  id: string;
  title: string;
  status: IssueStatus;
  type: IssueType;
  priority: IssuePriority;
}

export const MOCK_LANES: JLane[] = [
  {
    id: IssueStatus.BACKLOG,
    title: "Backlog",
    issues: [
      {
        id: "0001",
        priority: IssuePriority.MEDIUM,
        status: IssueStatus.BACKLOG,
        title: "Behind the 900 stars - Update 08/2020",
        type: IssueType.STORY
      },
      {
        id: "0002",
        priority: IssuePriority.MEDIUM,
        status: IssueStatus.BACKLOG,
        title: "Who is the author of Angular Jira clone?",
        type: IssueType.STORY
      }
    ]
  },
  {
    id: IssueStatus.SELECTED,
    title: "To-Do",
    issues: [
      {
        id: "0003",
        priority: IssuePriority.MEDIUM,
        status: IssueStatus.SELECTED,
        title: "Set up Akita state management",
        type: IssueType.STORY
      }
    ]
  },
  {
    id: IssueStatus.IN_PROGRESS,
    title: "In Progress",
    issues: [
      {
        id: "0004",
        priority: IssuePriority.MEDIUM,
        status: IssueStatus.IN_PROGRESS,
        title: "Preparing backend API with GraphQL",
        type: IssueType.STORY
      }
    ]
  },
  {
    id: IssueStatus.DONE,
    title: "Done",
    issues: [
      {
        id: "0005",
        priority: IssuePriority.MEDIUM,
        status: IssueStatus.DONE,
        title: "Preparing backend API with GraphQL",
        type: IssueType.STORY
      }
    ]
  }
];
