import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { TaskFile } from '../models/task.model';
@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private http = inject(HttpClient);
  uploadForTask(taskId: number, file: File): Observable<TaskFile> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<TaskFile>(API_ENDPOINTS.files.upload(taskId), form);
  }
  getTaskFiles(taskId: number): Observable<TaskFile[]> {
    return this.http.get<TaskFile[]>(API_ENDPOINTS.files.list(taskId));
  }
  deleteFile(taskId: number, fileId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(API_ENDPOINTS.files.delete(taskId, fileId));
  }
  getPreviewUrl(taskId: number, fileName: string): string {
    return API_ENDPOINTS.files.preview(taskId, fileName);
  }
  getDownloadUrl(taskId: number, fileName: string): string {
    return API_ENDPOINTS.files.download(taskId, fileName);
  }
}