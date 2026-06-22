export interface LoginResponse {
  token: string;
  role: string;
  name: string;
  userId: number;
}

export interface AuthUser {
  name: string;
  role: string;
  userId: number;
}