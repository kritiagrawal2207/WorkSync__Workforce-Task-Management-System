import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/departmentmodel';
import { API_ENDPOINTS } from '../constants/api-endpoints';
@Injectable({ providedIn: 'root' })
export class DepartmentService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(API_ENDPOINTS.departments.root);
  }
}