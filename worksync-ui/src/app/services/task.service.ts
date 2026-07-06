import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {TaskItem, TaskComment,TaskCreateRequest, TaskAssignRequest,TaskStatusUpdateRequest, TaskCommentCreateRequest,} from '../models/task.model';
@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  getAll(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(API_ENDPOINTS.tasks.root);
  }
  getById(taskId: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(API_ENDPOINTS.tasks.byId(taskId));
  }
  getByEmployee(employeeId: number): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(API_ENDPOINTS.tasks.byEmployee(employeeId));
  }
  create(request: TaskCreateRequest): Observable<{ message: string; taskId: number }> {
    return this.http.post<{ message: string; taskId: number }>(API_ENDPOINTS.tasks.root, request);
  }
  update(taskId: number, request: TaskCreateRequest): Observable<TaskItem> {
    return this.http.put<TaskItem>(API_ENDPOINTS.tasks.byId(taskId), request);
  }
  delete(taskId: number): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.tasks.byId(taskId));
  }
  updateStatus(taskId: number, request: TaskStatusUpdateRequest): Observable<{ message: string; status: string }> {
    return this.http.put<{ message: string; status: string }>(API_ENDPOINTS.tasks.updateStatus(taskId), request);
  }
  assign(request: TaskAssignRequest): Observable<{ message: string; assignmentId: number }> {
    return this.http.post<{ message: string; assignmentId: number }>(API_ENDPOINTS.tasks.assign, request);
  }
  addComment(request: TaskCommentCreateRequest): Observable<TaskComment> {
    return this.http.post<TaskComment>(API_ENDPOINTS.tasks.comment, request);
  }
}