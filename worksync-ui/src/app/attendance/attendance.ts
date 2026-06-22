import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../shared/services/attendance.service';
import { EmployeeService } from '../shared/services/employee.service';
import { Employee } from '../shared/models/employee.model';
import { Attendance } from '../shared/models/attendance.model';
import { ATTENDANCE_TEXT, COMMON_TEXT } from '../shared/constants/ui-strings';
import { LoaderComponent } from '../shared/components/loader/loader';
import { ButtonComponent } from '../shared/components/button/button';

type BannerType = 'success' | 'error' | '';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, ButtonComponent],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class AttendanceComponent implements OnInit {
  private attendanceService = inject(AttendanceService);
  private employeeService = inject(EmployeeService);

  readonly text = ATTENDANCE_TEXT;
  readonly commonText = COMMON_TEXT;

  employees = signal<Employee[]>([]);
  attendanceRecords = signal<Attendance[]>([]);
  todayAttendance = signal<Attendance | null>(null);
  isLoading = signal<boolean>(false);

  selectedEmployeeId: number | null = null;
  filterEmployeeId: number | null = null;
  selectedStatus: string = this.text.statusOptions[0];

  banner = signal<string>('');
  bannerType = signal<BannerType>('');

  isCheckedInToday = computed(() => {
    const record = this.todayAttendance();
    return !!record && !record.checkOut;
  });

  ngOnInit(): void {
    this.loadEmployees();
    this.loadHistory();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (employees) => this.employees.set(employees),
      error: () => this.showBanner(this.text.loadError, 'error')
    });
  }

  loadHistory(): void {
    this.isLoading.set(true);
    this.attendanceService.getAll().subscribe({
      next: (records) => {
        this.attendanceRecords.set(records);
        this.isLoading.set(false);
      },
      error: () => {
        this.showBanner(this.text.loadError, 'error');
        this.isLoading.set(false);
      }
    });
  }

  onEmployeeSelected(): void {
    this.todayAttendance.set(null);
    if (!this.selectedEmployeeId) return;

    this.attendanceService.getToday(this.selectedEmployeeId).subscribe({
      next: (record) => this.todayAttendance.set(record),
      error: () => this.todayAttendance.set(null)
    });
  }

  checkIn(): void {
    if (!this.selectedEmployeeId) {
      this.showBanner(this.text.selectEmployeeWarning, 'error');
      return;
    }
    this.attendanceService.checkIn({
      employeeId: this.selectedEmployeeId,
      checkIn: new Date().toISOString(),
      status: this.selectedStatus
    }).subscribe({
      next: (record) => {
        this.todayAttendance.set(record);
        this.showBanner(this.text.checkInSuccess, 'success');
        this.loadHistory();
      },
      error: () => this.showBanner(this.text.checkInError, 'error')
    });
  }

  checkOut(): void {
    const record = this.todayAttendance();
    if (!record) return;
    this.attendanceService.checkOut(record.id, {
      checkOut: new Date().toISOString(),
      status: this.selectedStatus
    }).subscribe({
      next: (updated) => {
        this.todayAttendance.set(updated);
        this.showBanner(this.text.checkOutSuccess, 'success');
        this.loadHistory();
      },
      error: () => this.showBanner(this.text.checkOutError, 'error')
    });
  }

  get filteredHistory(): Attendance[] {
    const records = this.attendanceRecords();
    if (!this.filterEmployeeId) return records;
    return records.filter(r => r.employeeId === this.filterEmployeeId);
  }

  private showBanner(message: string, type: BannerType): void {
    this.banner.set(message);
    this.bannerType.set(type);
    setTimeout(() => this.banner.set(''), 4000);
  }
}