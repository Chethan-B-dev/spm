import { ITask, TaskStatus } from "./task.interface";

export interface ITodo {
  id: number;
  name: string;
  task?: ITask;
  status: TodoStatus;
  createdOn: Date;
}

export enum TodoStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const TodoStatusOptions = [...Object.keys(TodoStatus)];

export interface TodoStatistics {
  [status: string]: number;
}

export function getTodoStatistics(todos: ITodo[]): TodoStatistics {
  const todoStatistics: TodoStatistics = {
    [TodoStatus.TO_DO]: 0,
    [TodoStatus.IN_PROGRESS]: 0,
    [TodoStatus.DONE]: 0,
  };
  todos.forEach((todo) => (todoStatistics[todo.status] += 1));
  return todoStatistics;
}

export function getProjectProgress(tasks: ITask[]): number {
  let completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED
  ).length;
  return ((completedTasks / tasks.length) * 100) | 0;
}
