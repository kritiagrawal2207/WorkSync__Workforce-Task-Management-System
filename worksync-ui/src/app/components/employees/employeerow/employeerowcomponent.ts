import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employeemodel';
import { constants } from '../../../constants/string';
@Component({
  selector: '[app-employee-row]',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './employeerowcomponent.html',
})
export class EmployeeRowComponent {
  @Input() employee!: Employee;
  @Input() canToggleStatus = false;  
  @Output() delete    = new EventEmitter<void>();
  @Output() activate  = new EventEmitter<void>();
  @Output() deactivate = new EventEmitter<void>();
  protected readonly constants = constants;
}