
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../models/employeemodel';
import { EmployeeRowComponent } from '../employeerow/employeerowcomponent';
import { constants } from '../../../constants/string';
@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [EmployeeRowComponent],
  templateUrl: './employeetablecomponent.html',
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
  @Output() delete = new EventEmitter<Employee>();
  protected readonly constants = constants;
}