import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../models/employeemodel';
import { constants } from '../../../constants/string';
@Component({
  selector: '[app-employee-row]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employeerowcomponent.html',
})
export class EmployeeRowComponent {
  @Input() employee!: Employee;
  @Output() delete = new EventEmitter<void>();
  protected readonly constants = constants;
}