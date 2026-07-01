import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../models/employeemodel';
import { EmployeeRowComponent } from '../employeerow/employeerowcomponent';
@Component({
  selector: 'app-employeetable',
  standalone: true,
  imports: [EmployeeRowComponent],
  templateUrl: './employeetablecomponent.html',
  styleUrl: './employeetablecomponent.css'
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
  @Output() delete = new EventEmitter<Employee>();
}