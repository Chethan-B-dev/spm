import { ITask } from "./task.interface";

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

export const TodoStatusOptions = [
  TodoStatus.TO_DO,
  TodoStatus.IN_PROGRESS,
  TodoStatus.DONE,
];

export interface TodoStatistics {
  [status: string]: number;
}

export function getTodoStatistics(todos: ITodo[]): TodoStatistics {
  const todoStatistics = {
    TO_DO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  };

  todos.forEach((todo) => {
    todoStatistics[todo.status] += 1;
  });

  return todoStatistics;
}
