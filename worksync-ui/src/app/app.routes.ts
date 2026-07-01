import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employees/employeelist/employeelist.component';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
];