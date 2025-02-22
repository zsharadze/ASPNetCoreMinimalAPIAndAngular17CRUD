import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EmployeeModel } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable()
export class EmployeeService {
  apiUrl = environment.API_URL;
  constructor(private http: HttpClient) {
    this.http = http;
  }

  getEmployees(searchText: string) {
    return this.http.get(this.apiUrl + '/employee/?searchText=' + searchText);
  }

  getEmployee(id: number) {
    return this.http.get(this.apiUrl + '/employee/' + id);
  }

  addEmployees(employee: EmployeeModel) {
    return this.http.post(this.apiUrl + '/employee/', employee);
  }

  editEmployees(employee: EmployeeModel) {
    return this.http.put(this.apiUrl + '/employee/', employee);
  }

  deleteEmployees(id: number) {
    return this.http.delete(this.apiUrl + '/employee/' + id);
  }
}
