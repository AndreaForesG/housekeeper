import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoomsService} from "../../services/rooms.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-create-rooms',
  templateUrl: './create-rooms.component.html',
  styleUrls: ['./create-rooms.component.scss']
})
export class CreateRoomsComponent implements OnInit {

  roomForm!:FormGroup;
  hotelId: number = 0;
  selectedFile: File | null = null;
  rooms: any;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateRoomsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomsService: RoomsService,
    private notificationService: NotificationService
  ) {
    this.hotelId = data.hotel_id;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadRooms();
  }

  initForm() {
    this.roomForm = this.fb.group({
      number: ['', Validators.required],
      floor: ['', Validators.required],
      hotel_id: [this.hotelId]
    });
  }

  addRoom() {
    this.roomsService.createRoom(this.roomForm.value).subscribe((response: any) => {
      this.notificationService.showSuccess('Habitación añadida con éxito');
      this.loadRooms();
      this.dialogRef.close(true);
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.notificationService.showError('No hay ningún archivo seleccionado');
      return;
    }

    this.roomsService.importRooms(this.selectedFile, this.hotelId).subscribe(response => {
      console.log('Archivo CSV subido:', response);
      this.notificationService.showSuccess('Habitaciones creadas correctamente');
      this.loadRooms();
      this.dialogRef.close(true);
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  loadRooms() {
    this.roomsService.getRoomsByHotel(this.hotelId).subscribe(rooms =>
     this.rooms = rooms
    );
  }
}
