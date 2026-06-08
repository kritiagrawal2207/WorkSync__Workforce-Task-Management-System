import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  employees: any[] = [];
  name = '';
  email = '';
  department = '';
  searchText = '';
  selectedEmployeeId: number = 0;
isEditMode = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    setTimeout(() => {
    this.loadEmployees();
  }, 100);
  }

  loadEmployees() {
    this.http
      .get<any[]>('http://localhost:5180/api/employee')
      .subscribe(data => {
        console.log('API Data:', data);
        this.employees = data;
        console.log('Employees Length:', this.employees.length);
      });
  }
  addEmployee() {
    if (!this.name || !this.email || !this.department) {
  alert('Please fill all fields');
  return;
}
    if (this.isEditMode) {

  const employee = {
    id: this.selectedEmployeeId,
    name: this.name,
    email: this.email,
    department: this.department,
    isActive: true
  };

  this.http
    .put(
      `http://localhost:5180/api/employee/${this.selectedEmployeeId}`,
      employee
    )
    .subscribe(() => {

      this.loadEmployees();

      this.name = '';
      this.email = '';
      this.department = '';

      this.isEditMode = false;
      

    });

  return;
}

  const employee = {
    name: this.name,
    email: this.email,
    department: this.department,
    isActive: true
  };

  console.log('Sending:', employee);

  this.http
    .post('http://localhost:5180/api/employee', employee)
    .subscribe({
      next: (res) => {
        console.log('SUCCESS', res);
        this.loadEmployees();
      },
      error: (err) => {
        console.log('ERROR', err);
      }
    });
}
deleteEmployee(id: number) {

  console.log('Deleting ID:', id);

  this.http
    .delete(`http://localhost:5180/api/employee/${id}`, {
  responseType: 'text'
})
    .subscribe({
      next: (res) => {
        console.log('DELETE SUCCESS', res);
        this.loadEmployees();
      },
      error: (err) => {
        console.log('DELETE ERROR', err);
      }
    });
}
editEmployee(employee: any) {

  this.selectedEmployeeId = employee.id;

  this.name = employee.name;
  this.email = employee.email;
  this.department = employee.department;

  this.isEditMode = true;
}
get filteredEmployees() {
  return this.employees.filter((employee: any) =>
    employee.name
      .toLowerCase()
      .includes(this.searchText.toLowerCase())
  );
}
}