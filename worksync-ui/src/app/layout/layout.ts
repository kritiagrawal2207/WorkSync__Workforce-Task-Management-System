import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  strings = {
    brand: 'WorkSync',
    dashboard: 'Dashboard',
    employees: 'Employees',
    attendance: 'Attendance',
    tasks: 'Tasks',
    admin: 'Admin',
    logout: 'Logout'
  };

  user: any;
  role: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
    this.role = this.authService.getRole();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}