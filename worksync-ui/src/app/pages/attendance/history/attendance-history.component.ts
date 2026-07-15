import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AttendanceService } from '../../../services/attendance.service';
import { AuthService } from '../../../services/auth.service';
import { Attendance } from '../../../models/attendance.model';
import { constants } from '../../../constants/string';
@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-history.component.html',
})
export class AttendanceHistoryComponent implements OnInit {
  readonly constants = constants;
  records: Attendance[] = [];
  loading = true;
  employeeId = 0;
  userName = '';
  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const user = this.authService.getUser();
    this.employeeId = user?.employeeId ? Number(user.employeeId) : 0;
    this.userName = user?.name ?? '';
    if (!this.employeeId) { this.loading = false; this.cdr.detectChanges(); return; }
    this.attendanceService.getByEmployee(this.employeeId).subscribe({
      next: (data) => {
        this.records = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/attendance']);
  }
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }
  formatTime(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  }
  getDuration(record: Attendance): string {
    if (!record.checkIn || !record.checkOut) return '—';
    const diff = new Date(record.checkOut).getTime()
               - new Date(record.checkIn).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'present':return 'att-badge--present';
      case 'late':return 'att-badge--late';
      case 'half day': return 'att-badge--half';
      case 'absent':return 'att-badge--absent';
      default: return 'att-badge--present';
    }
  }
}