export interface IAppUser {
  id: number;
  username: string;
  password?: string;
  email: string;
  image?: string;
  phone: string;
  status: UserStatus;
  role: UserRole;
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
  image: string;
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

export interface UserDesignationStatistics {
  [designation: string]: { username: string; email: String }[];
}

export interface UserDesignationNameStatistics {
  [designation: string]: string[];
}

export interface UserDesignationStatisticsCount {
  [designation: string]: number;
}

export const UserDesignations = [...Object.keys(UserDesignation)];

export const avatarImage =
  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000";
