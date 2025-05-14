import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoomsService} from "../../services/rooms.service";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-create-rooms',
  templateUrl: './create-rooms.component.html',
  styleUrls: ['./create-rooms.component.scss']
})
export class CreateRoomsComponent implements OnInit {

  roomForm!: FormGroup;
  hotelId: number = 0;
  selectedFile: File | null = null;
  rooms: any;
  hotelLogued: any;
  plan_id: any;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateRoomsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomsService: RoomsService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.hotelId = data.hotel_id;
  }

  ngOnInit(): void {
    this.initForm();
    this.getLoggedInUser();
  }

  initForm() {
    this.roomForm = this.fb.group({
      number: ['', Validators.required],
      floor: ['', Validators.required],
      hotel_id: [this.hotelId]
    });
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.hotelLogued = data.hotel;
      this.plan_id = data.user.plan_id
    })
  }


  addRoom() {
    if (this.plan_id == 1) {
      if (this.rooms?.length >= 10) {
        this.notificationService.showError("Ha llegado al límite de habitaciones contratadas de su plan gratuito.");
        return;
      }
    }
    if (this.plan_id == 2) {
      if (this.rooms?.length >= 30) {
        this.notificationService.showError("Ha llegado al límite de habitaciones contratadas de su plan básico.");
        return;
      }
    }
    this.roomsService.createRoom(this.roomForm.value).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Habitación añadida con éxito');
        this.dialogRef.close(true);
      },
      error: (err) => {
        if (err.status === 409) {
          this.notificationService.showError(err.error.error);
        } else {
          this.notificationService.showError('Ocurrió un error inesperado');
        }
      }
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

    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;
      const lines = fileContent.split('\n').filter(line => line.trim() !== '');

      const numNewRooms = lines.length > 1 ? lines.length - 1 : 0;
      const totalRooms = this.rooms?.length + numNewRooms;

      let maxRooms = 0;
      if (this.plan_id === 1) maxRooms = 10;
      else if (this.plan_id === 2) maxRooms = 30;

      if (totalRooms > maxRooms) {
        this.notificationService.showError(
          `La importación excede el límite de habitaciones de su plan. Tiene ${this.rooms.length} habitaciones y el archivo contiene ${numNewRooms}. Límite: ${maxRooms}.`
        );
        return;
      }

      this.roomsService.importRooms(this.selectedFile as File, this.hotelId).subscribe(response => {
        if (!response.error) {
          this.notificationService.showSuccess('Habitaciones creadas correctamente');
          this.dialogRef.close();
        } else {
          this.notificationService.showError(response.error)
        }
      });
    };

    reader.onerror = () => {
      this.notificationService.showError('Error al leer el archivo');
    };

    reader.readAsText(this.selectedFile);
  }


  onClose(): void {
    this.dialogRef.close();
  }

}
