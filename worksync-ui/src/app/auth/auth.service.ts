import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:5180/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${API}/login`, { email, password });
  }

  saveSession(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      email: data.email,
      role: data.role
    }));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole() {
    return this.getUser()?.role ?? '';
  }

  isLoggedIn() {
    const token = this.getToken();
  if (!token) return false;

  try {
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; 
    if (Date.now() >= expiry) {
      this.logout(); 
      return false;
    }
    return true;
  } catch {
    this.logout();
    return false;
  }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}