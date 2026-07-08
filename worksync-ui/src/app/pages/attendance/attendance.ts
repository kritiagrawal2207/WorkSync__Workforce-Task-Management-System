import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';
import { Attendance } from '../../models/attendance.model';
import { constants } from '../../constants/string';
type AttendanceState = 'loading' | 'not-checked-in' | 'checked-in' | 'checked-out' | 'no-employee';
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
})
export class AttendanceComponent implements OnInit {
  protected readonly constants = constants;
  state: AttendanceState = 'loading';
  todayRecord: Attendance | null = null;
  employeeId = 0;
  actionLoading = false;
  errorMessage = '';
  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const user = this.authService.getUser();
    this.employeeId = user?.employeeId ? Number(user.employeeId) : 0;
    if (!this.employeeId) { this.state = 'no-employee'; return; }
    this.loadToday();
  }
  loadToday(): void {
    this.state = 'loading';
    this.attendanceService.getToday(this.employeeId).subscribe({
      next: (record) => {
        this.todayRecord = record;
        this.state = record.checkOut ? 'checked-out' : 'checked-in';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.state = err.status === 404 ? 'not-checked-in' : 'not-checked-in';
        if (err.status !== 404) {
          this.errorMessage = err.error?.message ?? 'Something went wrong. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }
  checkIn(): void {
    this.actionLoading = true;
    this.errorMessage = '';
    this.attendanceService.checkIn({
      employeeId: this.employeeId,
      checkIn: new Date().toISOString(),
      status: 'Present'
    }).subscribe({
      next: () => { this.actionLoading = false; this.loadToday(); },
      error: (err) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.message ?? constants.GENERIC_ERROR;
        this.cdr.detectChanges();
      }
    });
  }
  checkOut(): void {
    if (!this.todayRecord) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.attendanceService.checkOut(this.todayRecord.id, {
      checkOut: new Date().toISOString(),
      status: 'Present'
    }).subscribe({
      next: () => { this.actionLoading = false; this.loadToday(); },
      error: (err) => {
        this.actionLoading = false;
        this.errorMessage = err.error?.message ?? constants.GENERIC_ERROR;
        this.cdr.detectChanges();
      }
    });
  }
  viewHistory(): void {
    this.router.navigate(['/attendance/history']);
  }
  formatTime(dateStr: string | null | undefined): string {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  getDuration(): string {
    if (!this.todayRecord?.checkIn || !this.todayRecord?.checkOut) return '--';
    const diff = new Date(this.todayRecord.checkOut).getTime()
               - new Date(this.todayRecord.checkIn).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }
  get isCheckedOut(): boolean { return this.state === 'checked-out'; }
  get nowTime(): string {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  get nowDate(): string {
    return new Date().toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
    });
  }
  get statusLabel(): string {
    if (this.state === 'not-checked-in') return constants.ATTENDANCE_NOT_CHECKED_IN;
    if (this.state === 'checked-in')     return constants.ATTENDANCE_CHECKED_IN;
    if (this.state === 'checked-out')    return constants.ATTENDANCE_PRESENT;
    return '';
  }
}
