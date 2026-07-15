import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeCreateDto } from '../models/employeemodel';
import { API_ENDPOINTS } from '../constants/api-endpoints';
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(API_ENDPOINTS.employees.root);
  }
  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(API_ENDPOINTS.employees.byId(id));
  }
  create(dto: EmployeeCreateDto): Observable<Employee> {
    return this.http.post<Employee>(API_ENDPOINTS.employees.root, dto);
  }
  update(id: number, dto: EmployeeCreateDto): Observable<Employee> {
    return this.http.put<Employee>(API_ENDPOINTS.employees.byId(id), dto);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.employees.byId(id));
  }
  activate(id: number): Observable<{ message: string; isActive: boolean }> {
    return this.http.put<{ message: string; isActive: boolean }>(
      API_ENDPOINTS.employees.activate(id), {}
    );
  }
  deactivate(id: number): Observable<{ message: string; isActive: boolean }> {
    return this.http.put<{ message: string; isActive: boolean }>(
      API_ENDPOINTS.employees.deactivate(id), {}
    );
  }
}