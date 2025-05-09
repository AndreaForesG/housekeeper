import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOptionSelectionChange} from "@angular/material/core";

@Component({
  selector: 'app-assign-rooms-dialog',
  templateUrl: './assign-rooms-dialog.component.html',
  styleUrls: ['./assign-rooms-dialog.component.scss']
})
export class AssignRoomsDialogComponent implements OnInit {

  assignForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignRoomsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { users: any[], rooms: any[] }
  ) {
    this.assignForm = this.fb.group({
      user_id: ['', Validators.required],
      room_ids: [[], Validators.required],
      date_from: ['', Validators.required],
      date_to: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.assignForm.valid) {
      this.dialogRef.close(this.assignForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  onToggleAllRooms(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const allRoomIds = this.data.rooms.map(room => room.id);
      const current = this.assignForm.get('room_ids')?.value || [];

      const isAllSelected = allRoomIds.every(id => current.includes(id));

      this.assignForm.get('room_ids')?.setValue(
        isAllSelected ? [] : allRoomIds
      );
    }
  }

}
