import { Component } from '@angular/core';
import { EmployeeModel } from '../models/employee.model';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './addemployee.component.html',
  styleUrl: './addemployee.component.css',
})
export class AddEmployeeComponent {
  employeeId: number = 0;
  employeeForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    age: [
      '',
      Validators.compose([
        Validators.min(18),
        Validators.max(65),
        Validators.required,
      ]),
    ],
  });

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    let id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      //getemployee by id for edit
      this.employeeService.getEmployee(Number(id)).subscribe((res) => {
        this.employeeId = res.id;
        this.employeeForm.controls.fullName.setValue(res.fullName);
        this.employeeForm.controls.email.setValue(res.email);
        this.employeeForm.controls.age.setValue(res.age);
      });
    }
  }

  onEmployeeSubmit() {
    if (this.employeeForm.invalid) {
      console.log('form is invalid');
      return;
    }

    let employeeModel = new EmployeeModel(
      this.employeeId,
      this.employeeForm.get('fullName')?.value!,
      this.employeeForm.get('email')?.value!,
      Number(this.employeeForm.get('age')?.value!)
    );

    //creates new
    if (this.employeeId == 0) {
      this.employeeService.addEmployees(employeeModel).subscribe((res) => {
        this.router.navigate(['/']);
      });
    } else {
      //updates existing
      this.employeeService.editEmployees(employeeModel).subscribe((res) => {
        this.router.navigate(['/']);
      });
    }
  }
}
