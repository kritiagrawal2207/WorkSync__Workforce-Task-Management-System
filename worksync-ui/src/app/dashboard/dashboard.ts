import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <h2 style="margin:0 0 8px 0;">Dashboard</h2>
    <p style="color:#6b7280;">Welcome back, {{ user?.name }}! You are logged in as <strong>{{ user?.role }}</strong>.</p>
  `
})
export class DashboardComponent {
  user = inject(AuthService).getUser();
}