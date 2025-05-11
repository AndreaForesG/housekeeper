import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StatusService} from "../../services/status.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";
import {TasksService} from "../../services/tasks.service";

@Component({
  selector: 'app-create-tasks',
  templateUrl: './create-tasks.component.html',
  styleUrls: ['./create-tasks.component.scss']
})
export class CreateTasksComponent implements OnInit {

  taskForm!:FormGroup;
  hotelLogued: any;
  colors: string[] = [
    '#ef3109', '#81d18f', '#a3dde8', '#e9ed9a', '#A833FF', '#FF33A1',
    '#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD', '#2ECC71',
    '#E74C3C', '#3498DB', '#1ABC9C', '#9B59B6', '#34495E', '#16A085',
    '#27AE60', '#2980B9', '#8E44AD', '#2C3E50', '#F1C40F', '#E67E22',
    '#D35400', '#C0392B', '#BDC3C7', '#7F8C8D', '#95A5A6', '#ECF0F1',
    '#FFB6C1', '#FFD700', '#ADFF2F', '#00FFFF', '#DA70D6', '#FF69B4',
    '#CD5C5C', '#FF4500', '#DC143C', '#00FA9A', '#7B68EE', '#FF00FF',
    '#6A5ACD', '#BA55D3', '#9370DB', '#4682B4', '#5F9EA0', '#40E0D0',
    '#00CED1', '#48D1CC', '#20B2AA', '#008B8B', '#B0C4DE', '#ADD8E6',
    '#BDB76B', '#FA8072', '#F08080', '#FFA07A', '#E9967A', '#FFDEAD',
    '#DEB887', '#D2B48C', '#BC8F8F', '#FFE4C4', '#FFE4E1', '#FFF0F5',
    '#FFF5EE', '#F5F5DC', '#FDF5E6', '#F5DEB3', '#FFEBCD', '#E6E6FA',
    '#F8F8FF', '#DCDCDC', '#696969', '#A9A9A9', '#808080', '#C0C0C0',
    '#000000', '#FFFFFF'
  ];


  constructor(private fb: FormBuilder,
              private tasksService: TasksService,
              public dialogRef: MatDialogRef<CreateTasksComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
    this.getLoggedInUser();
  }

  initForm() {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required]
    })
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.hotelLogued = data.hotel;
    })
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        hotel_id: this.hotelLogued
      };
      this.tasksService.createTask(taskData).subscribe(
        (response: any) => {
          this.notificationService.showSuccess('Tarea creada con éxito!');
          this.dialogRef.close(true);
        },
      );
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
