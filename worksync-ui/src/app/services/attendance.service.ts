import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Attendance, AttendanceCreateRequest, AttendanceCheckOutRequest } from '../models/attendance.model';
@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private http = inject(HttpClient);
  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(API_ENDPOINTS.attendance.root);
  }
  getByEmployee(employeeId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(API_ENDPOINTS.attendance.byEmployee(employeeId));
  }
  getToday(employeeId: number): Observable<Attendance> {
    return this.http.get<Attendance>(API_ENDPOINTS.attendance.today(employeeId));
  }
  checkIn(request: AttendanceCreateRequest): Observable<Attendance> {
    return this.http.post<Attendance>(API_ENDPOINTS.attendance.root, request);
  }
  checkOut(attendanceId: number, request: AttendanceCheckOutRequest): Observable<Attendance> {
    return this.http.put<Attendance>(API_ENDPOINTS.attendance.checkOut(attendanceId), request);
  }
}