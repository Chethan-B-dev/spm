import { IProject, ProjectStatus } from "../shared/interfaces/project.interface";
import { TaskStatus, TaskPriority } from "../shared/interfaces/task.interface";
import { TodoStatus } from "../shared/interfaces/todo.interface";
import { UserRole, UserStatus, UserDesignation } from "../shared/interfaces/user.interface";

export const mockProject: IProject = {
  id: 13,
  manager: {
    id: 32,
    email: "test@test2.com",
    username: "test2",
    password: "lol",
    role: UserRole.MANAGER,
    phone: null,
    status: UserStatus.VERIFIED,
  },
  name: "new p2",
  fromDate: new Date(""),
  toDate: new Date(),
  status: ProjectStatus.IN_PROGRESS,
  description: "test project 2",
  users: [
    {
      id: 30,
      email: "test@test1.com",
      username: "test1",
      password: "lol",
      role: UserRole.EMPLOYEE,
      designation: UserDesignation.DEVELOPER,
      phone: null,
      status: UserStatus.VERIFIED,
    },
    {
      id: 31,
      email: "test@test2.com",
      username: "test2",
      password: "lol",
      role: UserRole.EMPLOYEE,
      designation: UserDesignation.TESTER,
      phone: null,
      status: UserStatus.VERIFIED,
    },
    // [1, 1, 0]
  ],
  tasks: [
    {
      id: 1,
      name: "testt1",
      description: "dsafdfsfsdfsdff",
      status: TaskStatus.IN_PROGRESS,
      createdDate: new Date(),
      deadLine: new Date(),
      priority: TaskPriority.MEDIUM,
      user: {
        id: 30,
        email: "test@test1.com",
        username: "test1",
        password: "lol",
        role: UserRole.EMPLOYEE,
        phone: "9591833072",
        status: UserStatus.VERIFIED,
      },
      todos: [
        {
          id: 3,
          name: "dsfsddsfs",
          status: TodoStatus.IN_PROGRESS,
          createdOn: new Date("2022-06-29"),
        },
      ],
    },
    {
      id: 2,
      name: "test-task 2",
      description: "dsafdfasdsfsdfsdff",
      status: TaskStatus.IN_PROGRESS,
      createdDate: new Date("2022-19-06"),
      deadLine: new Date("2022-28-06"),
      priority: TaskPriority.LOW,
      user: {
        id: 30,
        email: "test@test1.com",
        username: "test1",
        password: "lol",
        role: UserRole.EMPLOYEE,
        phone: "9591833072",
        status: UserStatus.VERIFIED,
      },
      todos: [
        {
          id: 4,
          name: "dsdaaaafsddsfs",
          status: TodoStatus.IN_PROGRESS,
          createdOn: new Date("2022-06-29"),
        },
      ],
    },
    {
      id: 3,
      name: "test-task 3",
      description: "dsafasdfasdsfsdfsdff",
      status: TaskStatus.IN_PROGRESS,
      createdDate: new Date("2022-19-06"),
      deadLine: new Date("2022-28-06"),
      priority: TaskPriority.HIGH,
      user: {
        id: 30,
        email: "test@test1.com",
        username: "test1",
        password: "lol",
        role: UserRole.EMPLOYEE,
        phone: "9591833072",
        status: UserStatus.VERIFIED,
      },
      todos: [
        {
          id: 4,
          name: "dsdaaaafsddsfs",
          status: TodoStatus.IN_PROGRESS,
          createdOn: new Date("2022-06-29"),
        },
      ],
    },
  ],
  issues: [],
};
