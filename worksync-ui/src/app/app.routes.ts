import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

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
        loadComponent: () =>
          import('./employees/employee-list/employee-list').then(m => m.EmployeeListComponent)
      },
      {
  path: 'tasks',
  loadComponent: () =>
    import('./tasks/tasks').then(m => m.TasksComponent)
},
{
  path: 'admin',
  loadComponent: () =>
    import('./admin/admin').then(m => m.AdminComponent)
},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];