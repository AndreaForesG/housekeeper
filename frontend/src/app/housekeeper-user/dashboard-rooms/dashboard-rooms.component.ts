import {Component, Input, OnInit} from '@angular/core';
import {RoomsService} from "../../services/rooms.service";
import {StatusService} from "../../services/status.service";
import {TasksService} from "../../services/tasks.service";
import {UsersService} from "../../services/users.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {AssignRoomsDialogComponent} from "../assign-rooms-user-dialog/assign-rooms-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AssignRoomsService} from "../../services/assign-rooms.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AssignRoomsStatusComponent} from "../assign-rooms-status-dialog/assign-rooms-status.component";

interface Room {
  id: number;
  hotel_id: number;
  number: string;
  floor: number;
}

@Component({
  selector: 'app-dashboard-rooms',
  templateUrl: './dashboard-rooms.component.html',
  styleUrls: ['./dashboard-rooms.component.scss']
})
export class DashboardRoomsComponent implements OnInit {

  protected readonly Object = Object;
  rooms: any;
  status: any;
  tasks: any;
  users: any;
  @Input() hotelId!: any;
  groupedRooms: { [key: number]: any[] } = {};
  isMobile: boolean = false;
  filtersVisible: boolean = false;
  isAssigning: boolean = false;
  isLoading: any;

  constructor(private roomsService: RoomsService,
              private statusService: StatusService,
              private tasksService: TasksService,
              private usersService: UsersService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private assignRoomsService: AssignRoomsService,
              private snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
    this.loadData();
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  loadData() {
    this.statusService.getStatusByHotel(this.hotelId).subscribe(value => {
      this.status = value;
    })

    this.tasksService.getTasksByHotel(this.hotelId).subscribe(value => {
      this.tasks = value;
    })

    this.usersService.getEmployeesByHotel(this.hotelId).subscribe((value: any[]) => {
      this.users = value.filter(user => user.user_type !== "hotel_admin");
    })

    this.loadRooms();
  }

  loadRooms() {
    this.roomsService.getRoomsByHotel(this.hotelId).subscribe((rooms: Room[]) => {
      this.rooms = rooms;

      this.groupedRooms = this.rooms.reduce((acc: { [key: number]: Room[] }, room: Room) => {
        acc[room.floor] = acc[room.floor] || [];
        acc[room.floor].push(room);
        return acc;
      }, {} as { [key: number]: Room[] });

      Object.keys(this.groupedRooms).forEach(floor => {
        this.groupedRooms[+floor].sort((a, b) => Number(a.number) - Number(b.number));
      });
    });
  }

  assignEmployees() {
    const dialogRef = this.dialog.open(AssignRoomsDialogComponent, {
      width: '600px',
      data: {
        users: this.users,
        rooms: this.rooms
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formattedDateFrom = this.formatDate(result.date_from);
        const formattedDateTo = this.formatDate(result.date_to);

        if (new Date(formattedDateTo) < new Date(formattedDateFrom)) {
          this.snackBar.open('La fecha de fin no puede ser antes de la fecha de inicio', 'Cerrar', {duration: 5000});
          return;
        }

        const payload = {
          ...result,
          date_from: formattedDateFrom,
          date_to: formattedDateTo
        };

        this.assignRoomsService.assignRooms(payload).subscribe({
          next: (assignedRooms) => {
            this.updateRoomCards(assignedRooms.assignedRooms);
            this.loadRooms();
            this.snackBar.open('Habitaciones asignadas con éxito ✅', 'Cerrar', {duration: 3000});
          },
          error: (error: { error: { error: string; }; }) => {
            const msg = error.error?.error || 'Error al asignar habitaciones';
            this.snackBar.open(msg, 'Cerrar', {duration: 5000});
          }
        });
      }
    });
  }

  private updateRoomCards(assignedRooms: any[]): void {
    this.rooms = this.rooms.map((room: { id: any; assignedTo: null; }) => {
      const assigned = assignedRooms.find((assignment) => assignment.room_id === room.id);
      if (assigned) {
        room.assignedTo = assigned.assigned_to;
      } else {
        room.assignedTo = null;
      }
      return room;
    });
  }

  changeStatus() {
    const dialogRef = this.dialog.open(AssignRoomsStatusComponent, {
      width: '500px',
      data: {
        statuses: this.status,
        rooms: this.rooms,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loadRooms();
      }
    });
  }

  private updateRoomsStatus(statusRooms: any[]): void {
    this.rooms = this.rooms.map((room: { id: any; color: null; }) => {
      const assigned = statusRooms.find((status) => status.color === room.color);
      if (assigned) {
        room.color = assigned.color;
      } else {
        room.color = null;
      }
      return room;
    });
  }


  private formatDate(date: any): string {
    if (typeof date === 'string') return date;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

}


