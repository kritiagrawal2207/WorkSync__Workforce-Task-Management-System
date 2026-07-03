import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/auth.model';
import { DASHBOARD_TEXT } from '../../constants/string';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  readonly strings = DASHBOARD_TEXT;
  readonly user: AuthUser | null = inject(AuthService).getUser();
}