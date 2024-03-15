import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EmployeeModel } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {
  employees: EmployeeModel[] = [];
  public searchText!: string;
  public fullNameModelChanged: Subject<string> = new Subject<string>();
  private fullNameModelChangeSubscription!: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getEmployess();
    this.fullNameModelChangeSubscription = this.fullNameModelChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.getEmployess();
      });
  }

  getEmployess() {
    this.employeeService.getEmployees().subscribe((res) => {
      this.employees = res;
      if (this.searchText)
        this.employees = res.filter((e: EmployeeModel) =>
          e.fullName.includes(this.searchText)
        );
    });
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployees(id).subscribe((result) => {
      this.getEmployess();
    });
  }

  editEmployee(id: number) {
    this.router.navigate(['/addemployee'], { queryParams: { id: id } });
  }

  ngOnDestroy() {
    this.fullNameModelChangeSubscription.unsubscribe();
  }
}
