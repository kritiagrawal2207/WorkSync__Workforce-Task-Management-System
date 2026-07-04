import { Component, EventEmitter, Input, Output } from '@angular/core';
import { constants } from '../../constants/string';
@Component({
  selector: 'app-confirmdialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmdialogcomponent.html',
})
export class ConfirmDialogComponent {
  readonly constants = constants;
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