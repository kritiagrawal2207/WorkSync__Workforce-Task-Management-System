import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employees/employeelist/employeelistcomponent';
import { EmployeeFormComponent } from './components/employees/employeeform/employeeformcomponent';
export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/add', component: EmployeeFormComponent },
  { path: 'employees/edit/:id', component: EmployeeFormComponent },
  { path: '**', redirectTo: 'employees' },
];