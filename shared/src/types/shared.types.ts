export interface UserPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthInput = {
  email: string;
  password: string;
};

export type Authentication = {
  accessToken: string;
  refreshToken: string | null;
};

export type UserResponse = {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  accessToken: string;
  refreshToken: string | null;
};

export type UserRecord = {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

type Success<T> = {
  success: true;
  data: T;
  status: number;
};

type Failure = {
  success: false,
  error: string;
  status: number;
};

export type Result<T> = Success<T> | Failure;