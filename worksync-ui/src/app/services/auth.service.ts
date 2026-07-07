import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { LoginResponse, AuthUser } from '../models/auth.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.auth.login, { email, password });
  }
  saveSession(data: LoginResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      role: data.role,
      userId: data.userId,
      employeeId: data.employeeId ?? null
    } as AuthUser));
  }
  getToken(): string | null { return localStorage.getItem('token'); }
  getUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as AuthUser) : null;
  }
  getRole(): string { return this.getUser()?.role ?? ''; }
  getUserId(): number { return this.getUser()?.userId ?? 0; }
  getEmployeeId(): number { return this.getUser()?.employeeId ?? 0; }
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() >= payload.exp * 1000) { this.logout(); return false; }
      return true;
    } catch { this.logout(); return false; }
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}