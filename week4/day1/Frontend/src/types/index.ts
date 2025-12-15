export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}