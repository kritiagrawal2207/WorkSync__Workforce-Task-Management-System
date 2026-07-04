import { Routes } from '@angular/router';
import { LoginComponent }from './pages/login/login';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent }from './pages/dashboard/dashboard';
import { EmployeeListComponent }from './components/employees/employeelist/employeelistcomponent';
import { EmployeeFormComponent } from './components/employees/employeeform/employeeformcomponent';
import { AttendanceComponent }from './pages/attendance/attendance';
import { TasksComponent }from './pages/tasks/tasks';
import { AdminComponent } from './pages/admin/admin';
import { authGuard } from './guards/auth.guard';
import { roleGuard }from './guards/roleguard';
import { AttendanceHistoryComponent } from './pages/attendance/history/attendance-history.component'
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: '',component: LayoutComponent,canActivate: [authGuard],children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {path: 'employees',canActivate: [roleGuard],data: { roles: ['Admin', 'Manager'] },children: [
          { path: '', component: EmployeeListComponent },
          { path: 'add', component: EmployeeFormComponent },
          { path: 'edit/:id', component: EmployeeFormComponent },
        ]
      },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'tasks', component: TasksComponent },
      {path: 'admin',component: AdminComponent,canActivate: [roleGuard],data: { roles: ['Admin'] },
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
  {
  path: 'attendance',
  children: [
    { path: '',        component: AttendanceComponent },
    { path: 'history', component: AttendanceHistoryComponent }
  ]
},
];