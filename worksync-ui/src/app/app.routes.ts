import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/roleguard'; 

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Manager'] }, 
        loadComponent: () =>
          import('./employees/employee-list/employee-list').then(m => m.EmployeeListComponent)
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./attendance/attendance').then(m => m.AttendanceComponent)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./tasks/tasks').then(m => m.TasksComponent)
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }, // ← Admin only
        loadComponent: () =>
          import('./admin/admin').then(m => m.AdminComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];