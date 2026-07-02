import { Routes } from '@angular/router';
import { LoginComponent }from './auth/login/login';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent }from './dashboard/dashboard';
import { EmployeeListComponent }from './employees/employee-list/employee-list';
import { AttendanceComponent }from './attendance/attendance';
import { TasksComponent }from './tasks/tasks';
import { AdminComponent } from './admin/admin';
import { authGuard } from './auth/auth.guard';
import { roleGuard }from './auth/roleguard';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: '',component: LayoutComponent,canActivate: [authGuard],children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees',component: EmployeeListComponent,canActivate: [roleGuard],data: { roles: ['Admin', 'Manager'] },},
      { path: 'attendance', component: AttendanceComponent },
      { path: 'tasks',      component: TasksComponent },
      {path: 'admin',component: AdminComponent,canActivate: [roleGuard],data: { roles: ['Admin'] },
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];