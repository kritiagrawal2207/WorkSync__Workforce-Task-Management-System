import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employeemodel';
import { EmployeeRowComponent } from '../employeerow/employeerowcomponent';
import { constants } from '../../../constants/string';
@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, EmployeeRowComponent],
  templateUrl: './employeetablecomponent.html',
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
  @Input() canToggleStatus = false;
  @Output() delete     = new EventEmitter<Employee>();
  @Output() activate   = new EventEmitter<Employee>();
  @Output() deactivate = new EventEmitter<Employee>();
  protected readonly constants = constants;
}