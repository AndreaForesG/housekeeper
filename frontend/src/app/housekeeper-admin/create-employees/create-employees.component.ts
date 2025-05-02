import {Component, Inject, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {RolesService} from "../../services/roles.service";
import {UsersService} from "../../services/users.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "../../services/notification.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-create-employees',
  templateUrl: './create-employees.component.html',
  styleUrls: ['./create-employees.component.scss']
})
export class CreateEmployeesComponent implements OnInit {

  employeeForm!: FormGroup;
  roles: any;
  hotelLogued: any;
  isEditMode: boolean = false;


  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private roleService: RolesService,
              private employeeService: UsersService,
              private notificationService: NotificationService,
              private authService: AuthService,
              public dialogRef: MatDialogRef<CreateEmployeesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }


  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.titleService.setTitle(data.title);
    });
    if(this.data) {
      this.isEditMode = true;
    }
    this.initForm();
    this.getRoles();
    this.getLoggedInUser();
  }

  initForm() {
    this.employeeForm = this.fb.group({
      name: [this.data?.employee?.name || '', Validators.required],
      email: [this.data?.employee?.email || '', [Validators.required, Validators.email]],
      role_id: [this.data?.employee?.role_id || '', Validators.required],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
    });
  }


  onClose(): void {
    this.dialogRef.close();
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.hotelLogued = data.hotel;
    })
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employeeData = {
        ...this.employeeForm.value,
        hotel_id: this.hotelLogued
      };

      if (this.data?.employee) {
        this.employeeService.updateEmployee(this.data.employee.id, employeeData).subscribe(
          (response: any) => {
            this.notificationService.showSuccess('Empleado actualizado con éxito!');
            this.dialogRef.close(true);
          }
        );
      } else {
        this.employeeService.createEmployees(employeeData).subscribe(
          (response: any) => {
            this.notificationService.showSuccess('Empleado creado con éxito!');
            this.dialogRef.close(true);
          }
        );
      }
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




