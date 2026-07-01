import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/departmentmodel';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5180/api/departments';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }
}