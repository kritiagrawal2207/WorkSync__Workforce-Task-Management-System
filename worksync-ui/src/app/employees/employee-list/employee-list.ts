import { FormsModule } from '@angular/forms';
import { Component, OnInit, signal,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, EmployeeCreateRequest } from '../../shared/services/employee.service';
import { Employee } from '../../shared/models/employee.model';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css', 
})
export class EmployeeListComponent implements OnInit {

   private employeeService = inject(EmployeeService);
  employees = signal<Employee[]>([]);
  name = '';
  email = '';
  phoneNumber = '';
  department = '';
  searchText = '';
  selectedEmployeeId = 0;
  isEditMode = false;
  isLoading = signal<boolean>(false);
  bannerMessage = signal<string>('');
  bannerType = signal<'success' | 'error' | ''>('');
  showBanner(message: string, type: 'success' | 'error' | ''): void {
  this.bannerMessage.set(message);
  this.bannerType.set(type);
}
  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.employeeService.getAll().subscribe({
      next: (res) => {
        this.employees.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.showBanner('Failed to load employees', 'error');
        this.isLoading.set(false);
      }
    });
  }

  addEmployee() {
    if (!this.name || !this.email || !this.phoneNumber || !this.department) {
      alert('Please fill all fields');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      alert('Enter valid email');
      return;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(this.phoneNumber)) {
      alert('Enter valid 10 digit phone number');
      return;
    }
    const departmentPattern = /^[A-Za-z\s]+$/;
    if (!departmentPattern.test(this.department)) {
      alert('Department can contain only letters');
      return;
    }
    if (this.name.length < 3) {
      alert('Name must be at least 3 characters');
      return;
    }

    const request: EmployeeCreateRequest = {
      name: this.name,
      email: this.email,
      phone: this.phoneNumber,
      department: this.department
    };

    if (this.isEditMode) {
      this.employeeService.update(this.selectedEmployeeId, request).subscribe({
        next: () => {
          alert('Employee Updated Successfully');
          this.resetForm();
          this.loadEmployees();
        },
        error: (err) => alert(err.error || 'Failed to update employee')
      });
      return;
    }
    this.employeeService.create(request).subscribe({
      next: () => {
        alert('Employee Added Successfully');
        this.resetForm();
        this.loadEmployees();
      },
      error: (err: any) => alert(err.error || 'Failed to add employee')
    });
  }
  deleteEmployee(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.employeeService.delete(id).subscribe({
      next: () => { alert('Employee Deleted Successfully'); this.loadEmployees(); },
      error: () => alert('Failed to delete employee')
    });
  }
  editEmployee(employee: any) {
    this.selectedEmployeeId = employee.id;
    this.name = employee.name;
    this.email = employee.email;
    this.phoneNumber = employee.phone;
    this.department = employee.department?.name;
    this.isEditMode = true;
  }

  get filteredEmployees() {
    return this.employees().filter((emp: any) =>
      emp.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  private resetForm(): void {
    this.name = '';
    this.email = '';
    this.phoneNumber = '';
    this.department = '';
    this.isEditMode = false;
    this.selectedEmployeeId = 0;
  }
}
