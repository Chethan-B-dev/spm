import {
  ITask,
  TaskPriority,
  TaskStatus,
} from "src/app/shared/interfaces/task.interface";
import { ITodo, TodoStatus } from "src/app/shared/interfaces/todo.interface";
import { IssueStatus, IssueType, IssuePriority } from "./issue-status";

export interface ILane {
  title: string;
  todos: ITodo[];
}

export const MOCK_LANES: ILane[] = [
  {
    title: "To-Do",
    todos: [
      {
        id: 1,
        name: "hello world",
        status: TodoStatus.IN_PROGRESS,
        createdOn: new Date(),
        task: {
          id: 2,
          name: "lol",
          deadLine: new Date(),
          description: "some lol",
          priority: TaskPriority.HIGH,
          status: TaskStatus.IN_PROGRESS,
          createdDate: new Date(),
          user: null,
          todos: [],
        },
      },
    ],
  },
  {
    title: "In-Progress",
    todos: [
      {
        id: 1,
        name: "hello world",
        status: TodoStatus.IN_PROGRESS,
        createdOn: new Date(),
        task: {
          id: 2,
          name: "lol",
          deadLine: new Date(),
          description: "some lol",
          priority: TaskPriority.HIGH,
          status: TaskStatus.IN_PROGRESS,
          createdDate: new Date(),
          user: null,
          todos: [],
        },
      },
    ],
  },
  {
    title: "Done",
    todos: [
      {
        id: 1,
        name: "hello world",
        status: TodoStatus.IN_PROGRESS,
        createdOn: new Date(),
        task: {
          id: 2,
          name: "lol",
          deadLine: new Date(),
          description: "some lol",
          priority: TaskPriority.HIGH,
          status: TaskStatus.IN_PROGRESS,
          createdDate: new Date(),
          user: null,
          todos: [],
        },
      },
    ],
  },
];
