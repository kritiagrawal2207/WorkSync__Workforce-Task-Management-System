import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DashboardSummary, Notification } from '../../shared/models/dashboard.model';
import { AuthUser } from '../../models/auth.model';
import { constants } from '../../constants/string';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,  RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  protected readonly constants = constants;
  readonly user: AuthUser | null = inject(AuthService).getUser();
  private readonly dashboardService    = inject(DashboardService);
  private readonly notificationService = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  summary: DashboardSummary | null = null;
  notifications: Notification[]    = [];
  unreadCount = 0;
  loading = true;
  error = false;
  showNotifPanel = false;
  isEmployee = false;
  completedPercent = 0;
  pendingPercent = 0;
  donutDash = `0 301.59`;
  maxWorkload = 1;
  readonly DONUT_CIRCUMFERENCE = 301.59;
  private notifPollingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly POLLING_INTERVAL_MS = 30_000;
  ngOnInit(): void {
    console.log('USER:', this.user);
    console.log('USER ID:', this.user?.userId);
    this.isEmployee = this.user?.role?.toLowerCase() === 'employee';
    this.loadSummary();
    if (this.user?.userId) {
      this.loadNotifications(this.user.userId);
      this.notifPollingInterval = setInterval(() => {
        this.loadNotifications(this.user!.userId);
      }, this.POLLING_INTERVAL_MS);
    }
  }
  ngOnDestroy(): void {
    if (this.notifPollingInterval !== null) {
      clearInterval(this.notifPollingInterval);
    }
  }
  private loadSummary(): void {
    this.loading = true;
    this.error   = false;
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
        this.completedPercent = data.totalTasks ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0;
        this.pendingPercent   = data.totalTasks ? Math.round((data.pendingTasks   / data.totalTasks) * 100) : 0;
        this.maxWorkload  = data.employeeWorkloads?.length ? Math.max(...data.employeeWorkloads.map((w: any) => w.taskCount)) : 1;
        const filled = ((data.attendancePercentage ?? 0) / 100) * this.DONUT_CIRCUMFERENCE;
        this.donutDash  = `${filled} ${this.DONUT_CIRCUMFERENCE}`;
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
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
  getWorkloadPercent(taskCount: number): number {
    return this.maxWorkload === 0 ? 0 : Math.round((taskCount / this.maxWorkload) * 100);
  }
}