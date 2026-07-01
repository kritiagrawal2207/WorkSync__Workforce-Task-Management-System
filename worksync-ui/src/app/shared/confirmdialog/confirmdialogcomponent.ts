import { Component, EventEmitter, Input, Output } from '@angular/core';
import { APP_CONSTANTS } from '../../constants/string';
@Component({
  selector: 'app-confirmdialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmdialogcomponent.html',
  styleUrl: './confirmdialogcomponent.css'
})
export class ConfirmDialogComponent {
  readonly constants = APP_CONSTANTS;
  @Input() employeeName = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  onConfirm(): void {
    this.confirmed.emit();
  }
  onCancel(): void {
    this.cancelled.emit();
  }
}