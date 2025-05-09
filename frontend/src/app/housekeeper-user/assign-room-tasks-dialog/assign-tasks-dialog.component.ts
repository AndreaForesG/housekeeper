import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOptionSelectionChange} from "@angular/material/core";

@Component({
  selector: 'app-assign-tasks-dialog',
  templateUrl: './assign-tasks-dialog.component.html',
  styleUrls: ['./assign-tasks-dialog.component.scss']
})
export class AssignTasksDialogComponent implements OnInit {

  tasksForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignTasksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tasks: any[], rooms: any[] }
  ) {
    this.tasksForm = this.fb.group({
      task_id: ['', Validators.required],
      room_ids: [[], Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.tasksForm.valid) {
      this.dialogRef.close(this.tasksForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  onToggleAllRooms(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const allRoomIds = this.data.rooms.map(room => room.id);
      const current = this.tasksForm.get('room_ids')?.value || [];

      const isAllSelected = allRoomIds.every(id => current.includes(id));

      this.tasksForm.get('room_ids')?.setValue(
        isAllSelected ? [] : allRoomIds
      );
    }
  }


}
