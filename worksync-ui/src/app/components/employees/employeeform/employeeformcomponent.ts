import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../../../models/departmentmodel';
import { EmployeeCreateDto } from '../../../models/employeemodel';
import { EmployeeService } from '../../../services/employeeservice';
import { DepartmentService } from '../../../services/departmentservice';
import { ToastService } from '../../../shared/toast/toastservice';
import { constants } from '../../../constants/string';
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './employeeformcomponent.html',
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  departments: Department[] = [];
  employeeId: number | null = null;
  isEditMode = false;
  isSubmitting = false;
  isLoadingEmployee = false;
  constants: any;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.loadDepartments();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.employeeId = Number(idParam);
      this.isEditMode = true;
      this.loadEmployeeForEdit(this.employeeId);
    }
  }
  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      departmentId: [null, [Validators.required]]
    });
  }
  private loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => {
      this.departments = data;
      this.cdr.detectChanges();  
    },
      error: () => this.toastService.show(constants.LOAD_DEPARTMENTS_ERROR, 'error')
    });
  }
  private loadEmployeeForEdit(id: number): void {
    this.isLoadingEmployee = true;
    this.employeeService.getById(id).subscribe({
      next: (employee) => {
        this.form.patchValue({
          name: employee.name,
          email: employee.email,
          phone: employee.phone ?? '',
          departmentId: employee.departmentId
        });
        this.isLoadingEmployee = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.show(constants.LOAD_EMPLOYEE_ERROR, 'error');
        this.isLoadingEmployee = false;
        this.cdr.detectChanges(); 
        this.router.navigate(['/employees']);
      }
    });
  }
  hasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorCode);
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const dto: EmployeeCreateDto = {
      name: this.form.value.name.trim(),
      email: this.form.value.email.trim(),
      phone: this.form.value.phone ? this.form.value.phone.trim() : undefined,
      departmentId: this.form.value.departmentId
    };
    const request$ = this.isEditMode && this.employeeId
      ? this.employeeService.update(this.employeeId, dto)
      : this.employeeService.create(dto);
    request$.subscribe({
      next: () => {
        this.toastService.show(
          this.isEditMode ? constants.EMPLOYEE_UPDATED_SUCCESS : constants.EMPLOYEE_ADDED_SUCCESS,
          'success'
        );
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.toastService.show(err.error?.message ?? constants.EMAIL_IN_USE_ERROR, 'error');
        } else {
          this.toastService.show(constants.GENERIC_ERROR, 'error');
        }
      }
    });
  }
}