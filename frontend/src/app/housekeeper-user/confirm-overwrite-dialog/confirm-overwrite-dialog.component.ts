import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-overwrite-dialog',
  templateUrl: './confirm-overwrite-dialog.component.html',
  styleUrls: ['./confirm-overwrite-dialog.component.scss']
})
export class ConfirmOverwriteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmOverwriteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNo(): void {
    this.dialogRef.close(false);
  }

  onYes(): void {
    this.dialogRef.close(true);
  }
}
