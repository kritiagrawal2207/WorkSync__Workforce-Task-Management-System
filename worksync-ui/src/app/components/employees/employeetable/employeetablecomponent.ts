
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../models/employeemodel';
import { EmployeeRowComponent } from '../employeerow/employeerowcomponent';
import { constants } from '../../../constants/string';
@Component({
  selector: 'app-employeetable',
  standalone: true,
  imports: [EmployeeRowComponent],
  templateUrl: './employeetablecomponent.html',
})
export class EmployeeTableComponent {
  readonly constants = constants;
  @Input() employees: Employee[] = [];
  @Output() delete = new EventEmitter<Employee>();
}