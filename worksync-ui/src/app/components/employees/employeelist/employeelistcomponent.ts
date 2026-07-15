import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employeemodel';
import { EmployeeService } from '../../../services/employeeservice';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../shared/toast/toastservice';
import { ConfirmDialogComponent } from '../../../shared/confirmdialog/confirmdialogcomponent';
import { EmployeeTableComponent } from '../employeetable/employeetablecomponent';
import { EmptyStateComponent } from '../../../shared/emptystate/emptystatecomponent';
import { LoadingSpinnerComponent } from '../../../shared/loadingspinner/loadingspinnercomponent';
import { constants } from '../../../constants/string';
import { UserRole } from '../../../enums/user-role.enum';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    RouterLink, CommonModule,
    ConfirmDialogComponent, EmployeeTableComponent,
    EmptyStateComponent, LoadingSpinnerComponent
  ],
  templateUrl: './employeelistcomponent.html',
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  showDeleteConfirm = false;
  employeeToDelete: Employee | null = null;
  protected readonly constants = constants;
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];
  get canToggleStatus(): boolean {
    const role = this.authService.getRole();
    return role === UserRole.Admin || role === UserRole.Manager;
  }
  get totalPages(): number { return Math.ceil(this.filteredEmployees.length / this.pageSize); }
  get pagedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }
  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void { this.loadEmployees(); }
  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = constants.UNABLE_TO_LOAD_EMPLOYEES;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilter();
  }
  private applyFilter(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.filteredEmployees = !query ? this.employees :
      this.employees.filter(emp =>
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.departmentName.toLowerCase().includes(query) ||
        (emp.phone ?? '').toLowerCase().includes(query)
      );
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
  onPageSizeChange(size: number): void {
    this.pageSize = Number(size);
    this.currentPage = 1;
  }
  get paginationStart(): number { return this.filteredEmployees.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get paginationEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length); }
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
    const { id, name } = this.employeeToDelete;
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== id);
        this.applyFilter();
        if (this.currentPage > this.totalPages && this.totalPages > 0)
          this.currentPage = this.totalPages;
        this.toastService.show(constants.DELETE_SUCCESS.replace('{name}', name), 'success');
        this.showDeleteConfirm = false;
        this.employeeToDelete = null;
      },
      error: () => {
        this.toastService.show(constants.DELETE_FAILED, 'error');
        this.showDeleteConfirm = false;
      }
    });
  }
  onActivate(employee: Employee): void {
    this.employeeService.activate(employee.id).subscribe({
      next: () => {
        employee.isActive = true;
        this.toastService.show(employee.name + constants.EMPLOYEE_ACTIVATED_SUFFIX, 'success');
        this.cdr.detectChanges();
      },
      error: () => this.toastService.show(constants.EMPLOYEE_ACTIVATE_FAILED, 'error')
    });
  }
  onDeactivate(employee: Employee): void {
    this.employeeService.deactivate(employee.id).subscribe({
      next: () => {
        employee.isActive = false;
        this.toastService.show(employee.name + constants.EMPLOYEE_DEACTIVATED_SUFFIX, 'success');
        this.cdr.detectChanges();
      },
      error: () => this.toastService.show(constants.EMPLOYEE_DEACTIVATE_FAILED, 'error')
    });
  }
}