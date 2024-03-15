import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { APIurls } from '../urls';
import { EmployeeModel } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {
    this.http = http;
  }

  getEmployees() {
    return this.http.get<any>(APIurls.employee);
  }

  getEmployee(id: number) {
    return this.http.get<any>(APIurls.employee + '/' + id);
  }

  addEmployees(employee: EmployeeModel) {
    return this.http.post<any>(APIurls.employee, employee);
  }

  editEmployees(employee: EmployeeModel) {
    return this.http.put<any>(APIurls.employee, employee);
  }

  deleteEmployees(id: number) {
    return this.http.delete<any>(APIurls.employee + '/' + id);
  }
}
