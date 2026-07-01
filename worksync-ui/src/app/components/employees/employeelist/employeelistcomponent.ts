import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../models/employeemodel';
import { EmployeeService } from '../../../services/employeeservice';
import { ToastService } from '../../../shared/toast/toastservice';
import { ConfirmDialogComponent } from '../../../shared/confirmdialog/confirmdialogcomponent';
import { EmployeeTableComponent } from '../employeetable/employeetablecomponent';
import { EmptyStateComponent } from '../../../shared/emptystate/emptystatecomponent';
import { LoadingSpinnerComponent } from '../../../shared/loadingspinner/loadingspinnercomponent';
import { APP_CONSTANTS } from '../../../constants/string';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    RouterLink,
    ConfirmDialogComponent,
    EmployeeTableComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './employeelistcomponent.html',
  styleUrl: './employeelistcomponent.css'
})
export class EmployeeListComponent implements OnInit {
  readonly constants = APP_CONSTANTS;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  showDeleteConfirm = false;
  employeeToDelete: Employee | null = null;
  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.loadEmployees();
  }
  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = this.constants.UNABLE_TO_LOAD_EMPLOYEES;
        this.isLoading = false;
      }
    });
  }
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilter();
  }
  private applyFilter(): void {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      this.filteredEmployees = this.employees;
      return;
    }
    this.filteredEmployees = this.employees.filter((emp) =>
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.departmentName.toLowerCase().includes(query) ||
      (emp.phone ?? '').toLowerCase().includes(query)
    );
  }
  askDelete(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeleteConfirm = true;
  }
  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
  }
  confirmDelete(): void {
    if (!this.employeeToDelete) return;
    const id = this.employeeToDelete.id;
    const name = this.employeeToDelete.name;
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.employees = this.employees.filter((e) => e.id !== id);
        this.applyFilter();
        this.toastService.show(this.constants.DELETE_SUCCESS.replace('{name}', name), 'success');
        this.showDeleteConfirm = false;
        this.employeeToDelete = null;
      },
      error: () => {
        this.toastService.show(this.constants.DELETE_FAILED, 'error');
        this.showDeleteConfirm = false;
      }
    });
  }
}