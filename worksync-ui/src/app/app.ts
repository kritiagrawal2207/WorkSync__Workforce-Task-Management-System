import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  employees = signal<any[]>([]);
  searchText = '';
  isLoading = signal(false);
  displayedColumns = ['name', 'department', 'phoneNumber', 'actions'];

  private apiUrl = 'http://localhost:5180/api/employee';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading.set(true);
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.employees.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.showToast('Failed to load employees. Check if the backend is running.', 'error');
        this.isLoading.set(false);
      }
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addEmployee(result);
    });
  }

  openEditDialog(employee: any) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { isEdit: true, employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.updateEmployee(employee.id, result);
    });
  }

  openDeleteDialog(employee: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { employeeName: employee.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.deleteEmployee(employee.id);
    });
  }

  addEmployee(formData: any) {
    const payload = { ...formData, isActive: true };
    this.isLoading.set(true);
    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.loadEmployees();
        this.showToast('Employee added successfully', 'success');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showToast(err.error || 'Failed to add employee', 'error');
      }
    });
  }

  updateEmployee(id: number, formData: any) {
    const payload = { id, ...formData, isActive: true };
    this.isLoading.set(true);
    this.http.put(`${this.apiUrl}/${id}`, payload).subscribe({
      next: () => {
        this.loadEmployees();
        this.showToast('Employee updated successfully', 'success');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showToast(err.error || 'Failed to update employee', 'error');
      }
    });
  }

  deleteEmployee(id: number) {
    this.isLoading.set(true);
    this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.loadEmployees();
        this.showToast('Employee deleted successfully', 'success');
      },
      error: () => {
        this.isLoading.set(false);
        this.showToast('Failed to delete employee', 'error');
      }
    });
  }

  get filteredEmployees() {
    const q = this.searchText.toLowerCase().trim();
    if (!q) return this.employees();
    return this.employees().filter(emp =>
      emp.name.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q)
    );
  }

  getDeptColor(dept: string): string {
    const colors: Record<string, string> = {
      'IT': 'dept-it',
      'HR': 'dept-hr',
      'Finance': 'dept-finance',
      'Marketing': 'dept-marketing',
      'Admin': 'dept-admin'
    };
    return colors[dept] || 'dept-default';
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Dismiss', {
      duration: 4000,
      panelClass: type === 'success' ? 'toast-success' : 'toast-error',
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
