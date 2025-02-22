import { Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { AddEmployeeComponent } from './addemployee/addemployee.component';


export const routes: Routes = [
  { path: '' , component: EmployeesComponent },
  { path: 'addemployee', component: AddEmployeeComponent },
  { path: 'addemployee/:id', component: AddEmployeeComponent },
  
];
