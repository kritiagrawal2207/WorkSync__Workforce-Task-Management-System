import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { DashboardSummary } from '../models/dashboard.model';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
 
  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(API_ENDPOINTS.dashboard.summary);
  }
}