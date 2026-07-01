import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from './constants/string';

export interface EmployeeDialogData {
  isEdit: boolean;
  employee?: any;
}

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ data.isEdit ? constants.EDIT_EMPLOYEE_TITLE : constants.ADD_EMPLOYEE_TITLE }}</h2>
        <p class="dialog-subtitle">
          {{ data.isEdit ? constants.EMPLOYEE_FORM_SUBTITLE_EDIT : constants.EMPLOYEE_FORM_SUBTITLE_ADD }}
        </p>
      </div>

      <mat-dialog-content>
        <form [formGroup]="form" class="dialog-form">

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ constants.FULL_NAME_LABEL }}</mat-label>
            <input matInput formControlName="name" [placeholder]="constants.NAME_PLACEHOLDER" />
            @if (form.get('name')?.touched && form.get('name')?.hasError('required')) {
              <mat-error>{{ constants.NAME_REQUIRED }}</mat-error>
            }
            @if (form.get('name')?.touched && form.get('name')?.hasError('minlength')) {
              <mat-error>{{ constants.NAME_MIN_LENGTH }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ constants.EMAIL_ADDRESS_LABEL }}</mat-label>
            <input matInput formControlName="email" type="email" [placeholder]="constants.EMAIL_PLACEHOLDER" />
            @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
              <mat-error>{{ constants.EMAIL_REQUIRED }}</mat-error>
            }
            @if (form.get('email')?.touched && form.get('email')?.hasError('email')) {
              <mat-error>{{ constants.EMAIL_INVALID }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ constants.PHONE_NUMBER_LABEL }}</mat-label>
            <input matInput formControlName="phoneNumber" [placeholder]="constants.PHONE_PLACEHOLDER" maxlength="10" />
            @if (form.get('phoneNumber')?.touched && form.get('phoneNumber')?.hasError('required')) {
              <mat-error>{{ constants.PHONE_INVALID }}</mat-error>
            }
            @if (form.get('phoneNumber')?.touched && form.get('phoneNumber')?.hasError('pattern')) {
              <mat-error>{{ constants.PHONE_INVALID }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ constants.DEPARTMENT_LABEL }}</mat-label>
            <mat-select formControlName="department">
              <mat-option value="IT">IT</mat-option>
              <mat-option value="HR">HR</mat-option>
              <mat-option value="Finance">Finance</mat-option>
              <mat-option value="Marketing">Marketing</mat-option>
              <mat-option value="Admin">Admin</mat-option>
            </mat-select>
            @if (form.get('department')?.touched && form.get('department')?.hasError('required')) {
              <mat-error>{{ constants.DEPARTMENT_REQUIRED }}</mat-error>
            }
          </mat-form-field>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-stroked-button mat-dialog-close>{{ constants.CANCEL_BUTTON }}</button>
        <button
          mat-flat-button
          class="save-btn"
          (click)="onSubmit()"
        >
          {{ data.isEdit ? constants.UPDATE_EMPLOYEE : constants.ADD_EMPLOYEE }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 460px;
    }
    .dialog-header {
      padding: 24px 24px 8px;
    }
    .dialog-title {
      margin: 0 0 4px;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .dialog-subtitle {
      margin: 0;
      font-size: 13px;
      color: #6b7280;
    }
    .dialog-form {
      display: flex;
      flex-direction: column;
      padding: 8px 0 0;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      padding: 8px 24px 20px;
      gap: 8px;
    }
    .save-btn {
      background-color: #3b5bdb !important;
      color: white !important;
    }
  `]
})
export class EmployeeDialogComponent implements OnInit {
  readonly constants = APP_CONSTANTS;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      department: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data.isEdit && this.data.employee) {
      this.form.patchValue({
        name: this.data.employee.name,
        email: this.data.employee.email,
        phoneNumber: this.data.employee.phoneNumber,
        department: this.data.employee.department
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
