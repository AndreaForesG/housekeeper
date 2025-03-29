import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StatusService} from "../../services/status.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-create-status',
  templateUrl: './create-status.component.html',
  styleUrls: ['./create-status.component.scss']
})
export class CreateStatusComponent implements OnInit {

  statusForm!: FormGroup;
  hotelLogued: any;

  constructor(private fb: FormBuilder,
              private statusService: StatusService,
              public dialogRef: MatDialogRef<CreateStatusComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.initForm()
    this.getLoggedInUser();
  }

  initForm() {
    this.statusForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.hotelLogued = data.hotel;
    })
  }

  onSubmit() {
    if (this.statusForm.valid) {
      const statusData = {
        ...this.statusForm.value,
        hotel_id: this.hotelLogued
      };
      this.statusService.createStatus(statusData).subscribe(
        (response: any) => {
          this.notificationService.showSuccess('Estado creado con éxito!');
          this.dialogRef.close(true);
        },
      );
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}


