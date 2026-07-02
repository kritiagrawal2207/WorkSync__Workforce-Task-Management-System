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
    .confirm-container{
    padding:
        var(--spacing-3xl)
        var(--spacing-2xl)
        var(--spacing-xl);

    width:var(--dialog-width);
    text-align:center;
}

.confirm-icon-wrapper{
    width:var(--dialog-icon-container-size);
    height:var(--dialog-icon-container-size);
    border-radius:var(--radius-round);
    background:var(--color-danger-soft);

    display:flex;
    align-items:center;
    justify-content:center;

    margin:0 auto var(--spacing-lg);
}

.warn-icon{
    color:var(--color-danger);
    font-size:var(--icon-size-md);
    width:var(--icon-size-md);
    height:var(--icon-size-md);
}

.confirm-title{
    margin:0 0 var(--spacing-sm);
    font-size:var(--font-size-xl);
    font-weight:var(--font-weight-semibold);
    color:var(--color-text-primary);
}

.confirm-message{
    margin:0;
    font-size:var(--font-size-md);
    color:var(--color-text-subtle);
    line-height:var(--line-height-normal);
}

.confirm-actions{
    padding:var(--spacing-2xl) 0 0;
    gap:var(--spacing-sm);
}

.delete-confirm-btn{
    background:var(--color-danger)!important;
    color:var(--color-white)!important;
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
