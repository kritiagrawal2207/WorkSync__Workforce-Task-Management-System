import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Notification } from '../models/dashboard.model';
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  getByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      API_ENDPOINTS.notifications.byUser(userId)
    );
  }
  getUnreadCount(userId: number): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(
      API_ENDPOINTS.notifications.unreadCount(userId)
    );
  }
  markAsRead(notificationId: number): Observable<unknown> {
    return this.http.put(
      API_ENDPOINTS.notifications.markRead(notificationId), {}
    );
  }
  markAllAsRead(): Observable<unknown> {
    return this.http.put(API_ENDPOINTS.notifications.markAllRead, {});
  }
}