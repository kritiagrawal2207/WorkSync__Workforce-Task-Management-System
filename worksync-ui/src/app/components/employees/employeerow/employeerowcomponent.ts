import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../models/employeemodel';
import { APP_CONSTANTS } from '../../../constants/string';
@Component({
  selector: 'app-employeerow',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employeerowcomponent.html',
  styleUrl: './employeerowcomponent.css'
})
export class EmployeeRowComponent {
  readonly constants = APP_CONSTANTS;
  @Input() employee!: Employee;
  @Output() delete = new EventEmitter<void>();
}