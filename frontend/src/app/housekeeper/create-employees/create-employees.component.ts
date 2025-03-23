import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {RolesService} from "../../services/roles.service";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-create-employees',
  templateUrl: './create-employees.component.html',
  styleUrls: ['./create-employees.component.scss']
})
export class CreateEmployeesComponent implements OnInit {

  employeeForm!: FormGroup;
  roles: any;
  hotel_id: number = 1;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private roleService: RolesService,
              private employeeService: UsersService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.titleService.setTitle(data.title);
    });
    this.initForm();
    this.getRoles();
  }

  initForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      hotel_id: ['', Validators.required],

    });
  }


  onSubmit() {
    if (this.employeeForm.valid) {
      const employeeData = {
        ...this.employeeForm.value,
      };
      console.log(this.employeeForm.value)
      this.employeeService.createEmployees(employeeData).subscribe(
          (response: any) => {
          console.log('Empleado creado:', response);
        },
        error => {
          console.error('Error al crear el empleado', error);
        }
      );
    }
  }

  getRoles() {
    this.roleService.getAllRoles().subscribe(
      data => {
        this.roles = data;
        console.log(data)
      },
      error => {
        console.error('Error al obtener los roles', error)
      }
    );
  }



}




