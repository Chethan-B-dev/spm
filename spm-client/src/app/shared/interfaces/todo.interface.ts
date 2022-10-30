import { ITask, TaskStatus } from "./task.interface";

export interface ITodo {
  id: number;
  name: string;
  task?: ITask;
  status: TodoStatus;
  createdOn: Date;
  completedOn?: Date;
}

export interface IUpdateTodoDTO {
  todoName: string;
  taskId: number;
  status: TodoStatus;
}

export enum TodoStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const TodoStatusOptions = Object.keys(TodoStatus);

export interface TodoStatistics {
  [status: string]: number;
}

export function getTodoStatistics(todos: ITodo[]): TodoStatistics {
  const todoStatistics = TodoStatusOptions.reduce((stats, status) => {
    stats[status] = 0;
    return stats;
  }, {} as TodoStatistics);
  todos.forEach((todo) => (todoStatistics[todo.status] += 1));
  return todoStatistics;
}

export function getProjectProgress(tasks: ITask[]): number {
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED
  ).length;
  return ((completedTasks / tasks.length) * 100) | 0;
}
