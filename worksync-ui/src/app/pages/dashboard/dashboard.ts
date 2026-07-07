import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DashboardSummary, Notification } from '../../shared/models/dashboard.model';
import { AuthUser } from '../../models/auth.model';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  readonly constants = constants;
  readonly user: AuthUser | null = inject(AuthService).getUser();
  private readonly dashboardService    = inject(DashboardService);
  private readonly notificationService = inject(NotificationService);
  summary: DashboardSummary | null = null;
  notifications: Notification[]    = [];
  unreadCount    = 0;
  loading        = true;
  error          = false;
  showNotifPanel = false;
  ngOnInit(): void {
    this.loadSummary();
    if (this.user?.userId) {
      this.loadNotifications(this.user.userId);
    }
  }
  private loadSummary(): void {
    this.loading = true;
    this.error   = false;
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.error   = true;
        this.loading = false;
      },
    });
  }

  private loadNotifications(userId: number): void {
    this.notificationService.getByUser(userId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount   = data.filter(n => !n.isRead).length;
      },
    });
  }
  toggleNotifPanel(): void {
    this.showNotifPanel = !this.showNotifPanel;
  }
  closeNotifPanel(): void {
    this.showNotifPanel = false;
  }
  markRead(notification: Notification): void {
    if (notification.isRead) return;
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      },
    });
  }
  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => (n.isRead = true));
        this.unreadCount = 0;
      },
    });
  }
  retry(): void {
    this.loadSummary();
  }
  getCompletedPercent(): number {
    if (!this.summary?.totalTasks) return 0;
    return Math.round((this.summary.completedTasks / this.summary.totalTasks) * 100);
  }
  getPendingPercent(): number {
    if (!this.summary?.totalTasks) return 0;
    return Math.round((this.summary.pendingTasks / this.summary.totalTasks) * 100);
  }
  getMaxWorkload(): number {
    if (!this.summary?.employeeWorkloads?.length) return 1;
    return Math.max(...this.summary.employeeWorkloads.map(w => w.taskCount));
  }
  getWorkloadPercent(taskCount: number): number {
    const max = this.getMaxWorkload();
    return max === 0 ? 0 : Math.round((taskCount / max) * 100);
  }
  readonly DONUT_CIRCUMFERENCE = 301.59;
  getDonutDash(): string {
    const filled = ((this.summary?.attendancePercentage ?? 0) / 100) * this.DONUT_CIRCUMFERENCE;
    return `${filled} ${this.DONUT_CIRCUMFERENCE}`;
  }
}