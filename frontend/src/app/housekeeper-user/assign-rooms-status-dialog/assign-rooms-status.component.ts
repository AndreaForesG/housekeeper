import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {RoomStatusService} from "../../services/room-status.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-assign-rooms-status',
  templateUrl: './assign-rooms-status.component.html',
  styleUrls: ['./assign-rooms-status.component.scss']
})
export class AssignRoomsStatusComponent implements OnInit {

  changeStatusForm: FormGroup;
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private roomStatus: RoomStatusService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AssignRoomsStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rooms: any[],  statuses: any[] }
  ) {
    this.changeStatusForm = this.fb.group({
      rooms: [[], Validators.required],
      status: [null, Validators.required],
      date: [this.today, Validators.required]
    });
  }

  onSubmit() {
    if (this.changeStatusForm.valid) {
      const statusData = this.changeStatusForm.value;
      this.roomStatus.changeRoomStatus(statusData).subscribe(
        () => {
          this.snackBar.open('Estado de las habitaciones cambiado con éxito.', 'Cerrar', { duration: 3000 });
          this.dialogRef.close();
        },
        ( error: any) => {
          this.snackBar.open('Hubo un error al cambiar el estado.', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
