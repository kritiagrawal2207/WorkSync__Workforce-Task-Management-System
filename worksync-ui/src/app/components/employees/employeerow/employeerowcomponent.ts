import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../models/employeemodel';
import { constants } from '../../../constants/string';
@Component({
  selector: '[app-employeerow]',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employeerowcomponent.html',
})
export class EmployeeRowComponent {
  readonly constants = constants;
  @Input() employee!: Employee;
  @Output() delete = new EventEmitter<void>();
}