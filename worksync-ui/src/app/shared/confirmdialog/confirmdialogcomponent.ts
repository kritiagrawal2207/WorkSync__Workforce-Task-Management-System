import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-confirmdialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmdialogcomponent.html',
  styleUrl: './confirmdialogcomponent.css'
})
export class ConfirmDialogComponent {
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