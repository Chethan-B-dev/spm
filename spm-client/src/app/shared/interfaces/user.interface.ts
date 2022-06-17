export interface IAppUser {
  id: number;
  username: string;
  password: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  phone: string;
  designation?: UserDesignation;
  ranking?: number;
}

export interface IAppUserRanking {
  user: IAppUser;
  ranking: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignUpRequest {
  username: string;
  email: string;
  password: string;
  userRole: string;
  phone: string;
}

export interface IEditProfileRequest {
  username: string;
  phone: string;
  designation: UserDesignation;
}

export interface ILoginResponse {
  token: string;
  user: IAppUser;
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

export enum UserDesignation {
  DEVELOPER = "DEVELOPER",
  TESTER = "TESTER",
  DEVOPS = "DEVOPS",
}
