import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../shared/services/employee.service';
import { Employee } from '../../shared/models/employee.model';
interface EmpForm {
  name: string;
  email: string;
  phone: string;
  department: string;
}
interface FormErrors {
  name: string;
  email: string;
  phone: string;
  department: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  isLoading = false;
  isSaving = false;

  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  selectedEmployee: Employee | null = null;

  form: EmpForm = { name: '', email: '', phone: '', department: '' };
  formErrors: FormErrors = { name: '', email: '', phone: '', department: '' };

  toast = { show: false, message: '', type: 'success' as 'success' | 'error' };

  constructor(private empService: EmployeeService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadEmployees();
  }

loadEmployees() {
  this.isLoading = true;
  this.empService.getAll().subscribe({
    next: (data) => {
      this.employees = data;
      this.filteredEmployees = data;
      this.isLoading = false;
      this.cdr.detectChanges();  
    },
    error: () => {
      this.showToast('Failed to load employees', 'error');
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(e =>
      e.name.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.isEditMode = false;
    this.form = { name: '', email: '', phone: '', department: '' };
    this.formErrors = { name: '', email: '', phone: '', department: '' };
    this.showModal = true;
  }

  openEditModal(emp: Employee) {
    this.isEditMode = true;
    this.selectedEmployee = emp;
    this.form = {
      name: emp.name,
      email: emp.email,
      phone: emp.phone || '',
      department: emp.departmentId ? emp.departmentId.toString() : ''
    };
    this.formErrors = { name: '', email: '', phone: '', department: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEmployee = null;
  }

  validateField(field: keyof EmpForm) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    switch (field) {
      case 'name':
        this.formErrors.name = !this.form.name.trim()
          ? 'Name is required'
          : this.form.name.trim().length < 3
          ? 'Name must be at least 3 characters'
          : '';
        break;
      case 'email':
        this.formErrors.email = !this.form.email.trim()
          ? 'Email is required'
          : !emailRegex.test(this.form.email)
          ? 'Enter a valid email address'
          : '';
        break;
      case 'phone':
        this.formErrors.phone = !this.form.phone.trim()
          ? 'Phone number is required'
          : !phoneRegex.test(this.form.phone)
          ? 'Enter a valid 10-digit phone number'
          : '';
        break;
      case 'department':
        this.formErrors.department = !this.form.department
          ? 'Please select a department'
          : '';
        break;
    }
  }

  validateAll(): boolean {
    (['name', 'email', 'phone', 'department'] as (keyof EmpForm)[])
      .forEach(f => this.validateField(f));
    return !Object.values(this.formErrors).some(e => e !== '');
  }

  submitForm() {
    if (!this.validateAll()) return;

    this.isSaving = true;
   const payload = {
  name: this.form.name.trim(),
  email: this.form.email.trim(),
  phone: this.form.phone.trim(),
  departmentId: this.form.department ? Number(this.form.department) : null
};

    if (this.isEditMode && this.selectedEmployee) {
      this.empService.update(this.selectedEmployee.id, payload).subscribe({
        next: () => {
          this.showToast('Employee updated successfully', 'success');
          this.closeModal();
          this.loadEmployees();
          this.isSaving = false;
        },
        error: () => {
          this.showToast('Failed to update employee', 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.empService.create(payload).subscribe({
        next: () => {
          this.showToast('Employee added successfully', 'success');
          this.closeModal();
          this.loadEmployees();
          this.isSaving = false;
        },
        error: (err) => {
          this.showToast(err?.error?.message || 'Failed to add employee', 'error');
          this.isSaving = false;
        }
      });
    }
  }

  confirmDelete(emp: Employee) {
    this.selectedEmployee = emp;
    this.showDeleteModal = true;
  }

  deleteEmployee() {
    if (!this.selectedEmployee) return;
    this.empService.delete(this.selectedEmployee.id).subscribe({
      next: () => {
        this.showToast('Employee deleted successfully', 'success');
        this.showDeleteModal = false;
        this.loadEmployees();
      },
      error: () => {
        this.showToast('Failed to delete employee', 'error');
        this.showDeleteModal = false;
      }
    });
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { show: true, message, type };
    setTimeout(() => (this.toast.show = false), 3500);
  }
}