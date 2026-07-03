
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../models/employeemodel';
import { EmployeeRowComponent } from '../employeerow/employeerowcomponent';
import { APP_CONSTANTS } from '../../../constants/string';
@Component({
  selector: 'app-employeetable',
  standalone: true,
  imports: [EmployeeRowComponent],
  templateUrl: './employeetablecomponent.html',
  styleUrl: './employeetablecomponent.css'
})
export class EmployeeTableComponent {
  readonly constants = APP_CONSTANTS;
  @Input() employees: Employee[] = [];
  @Output() delete = new EventEmitter<Employee>();
}