import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Employee } from '../models/employee.model';

export interface EmployeeCreateRequest {
  name: string;
  email: string;
  phone?: string;
  department?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(API_ENDPOINTS.employees);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${API_ENDPOINTS.employees}/${id}`);
  }

  create(request: EmployeeCreateRequest): Observable<Employee> {
    return this.http.post<Employee>(API_ENDPOINTS.employees, request);
  }

  update(id: number, request: EmployeeCreateRequest): Observable<Employee> {
    return this.http.put<Employee>(`${API_ENDPOINTS.employees}/${id}`, request);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${API_ENDPOINTS.employees}/${id}`, { responseType: 'text' });
  }
}