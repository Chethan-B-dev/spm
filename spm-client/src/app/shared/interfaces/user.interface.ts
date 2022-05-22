export interface IAppUser {
  id: number;
  username: string;
  password: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  belongsToProject?: boolean;
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
