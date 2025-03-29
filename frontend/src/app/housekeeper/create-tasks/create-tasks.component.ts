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
      name: ['', Validators.required]
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
