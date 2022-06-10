export interface IAppUser {
  id: number;
  username: string;
  password: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  ranking?: number;
}

export interface IAppUserRanking {
  user: IAppUser;
  ranking: number;
}

export enum UserStatus {
  VERIFIED = "VERIFIED",
  UNVERIFIED = "UNVERIFIED",
  DISABLED = "DISABLED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}
