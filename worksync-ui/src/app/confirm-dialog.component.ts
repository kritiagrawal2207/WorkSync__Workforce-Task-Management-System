import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONSTANTS } from './constants/string';

export interface ConfirmDialogData {
  employeeName: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-container">
      <div class="confirm-icon-wrapper">
        <mat-icon class="warn-icon">delete_forever</mat-icon>
      </div>
      <h2 class="confirm-title">{{ constants.DELETE_EMPLOYEE_TITLE }}</h2>
      <p class="confirm-message">
        {{ constants.DELETE_EMPLOYEE_MESSAGE_PREFIX }} <strong>{{ data.employeeName }}</strong>?
        {{ constants.DELETE_EMPLOYEE_MESSAGE_SUFFIX }}
      </p>
      <mat-dialog-actions align="end" class="confirm-actions">
        <button mat-stroked-button mat-dialog-close>{{ constants.CANCEL_BUTTON }}</button>
        <button mat-flat-button class="delete-confirm-btn" [mat-dialog-close]="true">
          {{ constants.DELETE_BUTTON }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-container {
      padding: 32px 28px 20px;
      width: 360px;
      text-align: center;
    }
    .confirm-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #fee2e2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .warn-icon {
      color: #ef4444;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .confirm-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .confirm-message {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    .confirm-actions {
      padding: 24px 0 0;
      gap: 8px;
    }
    .delete-confirm-btn {
      background-color: #ef4444 !important;
      color: white !important;
    }
  `]
})
export class ConfirmDialogComponent {
  readonly constants = APP_CONSTANTS;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
