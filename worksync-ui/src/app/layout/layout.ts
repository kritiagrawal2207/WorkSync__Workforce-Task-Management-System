import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Constants } from '../shared/constants/string';

interface Notification {
  id: number;
  message: string;
  type: 'task' | 'attendance' | 'system';
  isRead: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  strings = Constants.layout;
  user = this.authService.getUser();
  role = this.authService.getRole();
  panelOpen = signal(false);

  notifications = signal<Notification[]>([
    { id: 1, message: 'New task assigned to you', type: 'task', isRead: false, createdAt: new Date(Date.now() - 3600000) },
    { id: 2, message: 'Attendance marked successfully', type: 'attendance', isRead: false, createdAt: new Date(Date.now() - 7200000) },
    { id: 3, message: 'System maintenance scheduled', type: 'system', isRead: true, createdAt: new Date(Date.now() - 86400000) }
  ]);

  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  

  ngOnInit(): void {}

  togglePanel(): void {
    this.panelOpen.update(v => !v);
  }

  markRead(id: number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  markAllRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}