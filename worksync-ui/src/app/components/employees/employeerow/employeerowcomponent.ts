import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../models/employeemodel';
@Component({
  selector: 'app-employeerow',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employeerowcomponent.html',
  styleUrl: './employeerowcomponent.css'
})
export class EmployeeRowComponent {
  @Input() employee!: Employee;
  @Output() delete = new EventEmitter<void>();
}