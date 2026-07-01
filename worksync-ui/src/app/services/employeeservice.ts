import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeCreateDto } from '../models/employeemodel';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5180/api/employees';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }
  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }
  create(dto: EmployeeCreateDto): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, dto);
  }
  update(id: number, dto: EmployeeCreateDto): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, dto);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}