import { FormsModule } from '@angular/forms';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css', 
})
export class EmployeeListComponent implements OnInit {

  employees = signal<any[]>([]);
  name = '';
  email = '';
  phoneNumber = '';
  department = '';
  searchText = '';
  selectedEmployeeId = 0;
  isEditMode = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.http
      .get<any[]>('http://localhost:5180/api/employee')
      .subscribe({
        next: (res) => {
          this.employees.set(res);
        },
        error: (err) => {
          console.log('API Error:', err);
        }
      });
  }

  addEmployee() {
    if (!this.name || !this.email || !this.phoneNumber || !this.department) {
      alert('Please fill all fields');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      alert('Enter valid email');
      return;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(this.phoneNumber)) {
      alert('Enter valid 10 digit phone number');
      return;
    }
    const departmentPattern = /^[A-Za-z\s]+$/;
    if (!departmentPattern.test(this.department)) {
      alert('Department can contain only letters');
      return;
    }
    if (this.name.length < 3) {
      alert('Name must be at least 3 characters');
      return;
    }

    if (this.isEditMode) {
      const employee = {
        id: this.selectedEmployeeId,
        name: this.name,
        email: this.email,
        phone: this.phoneNumber,
        department: this.department,
        isActive: true
      };
      this.http
        .put(`http://localhost:5180/api/employee/${this.selectedEmployeeId}`, employee)
        .subscribe({
          next: () => {
            this.loadEmployees();
            alert('Employee Updated Successfully');
            this.name = '';
            this.email = '';
            this.phoneNumber = '';
            this.department = '';
            this.isEditMode = false;
          },
          error: (err) => {
            // Backend se jo bhi error message aaya wo dikhao
            alert(err.error || 'Failed to update employee');
          }
        });
      return;
    }
    const employee = {
      name: this.name,
      email: this.email,
      phone: this.phoneNumber,
      department: this.department,
       //departmentId: Number(this.department)
      //isActive: true
    };
    this.http
      .post('http://localhost:5180/api/employee', employee)
      .subscribe({
        next: () => {
          this.loadEmployees();
          alert('Employee Added Successfully');
          this.name = '';
          this.email = '';
          this.phoneNumber = '';
          this.department = '';
        },
        error: (err) => {
          
          alert(err.error || 'Failed to add employee');
        }
      });
  }
  deleteEmployee(id: number) {
    const isConfirmed = confirm('Are you sure you want to delete this employee?');
    if (!isConfirmed) {
      return;
    }
    this.http
      .delete(`http://localhost:5180/api/employee/${id}`, { responseType: 'text' })
      .subscribe(() => {
        alert('Employee Deleted Successfully');
        this.loadEmployees();
      });
  }
  editEmployee(employee: any) {
    this.selectedEmployeeId = employee.id;
    this.name = employee.name;
    this.email = employee.email;
    this.phoneNumber = employee.phone;
    this.department = employee.department?.name;
    this.isEditMode = true;
  }

  get filteredEmployees() {
    return this.employees().filter((emp: any) =>
      emp.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
