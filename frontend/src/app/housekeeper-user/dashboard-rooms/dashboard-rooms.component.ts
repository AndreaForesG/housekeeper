import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import {ConfirmOverwriteDialogComponent} from "../confirm-overwrite-dialog/confirm-overwrite-dialog.component";
import {AssignTasksDialogComponent} from "../assign-room-tasks-dialog/assign-tasks-dialog.component";
import {RoomTasksService} from "../../services/room-tasks.service";

interface Room {
  id: number;
  hotel_id: number;
  number: string;
  floor: number;
  status: string;
  status_color: string;
  assigned_to: string;
}

@Component({
  selector: 'app-dashboard-rooms',
  templateUrl: './dashboard-rooms.component.html',
  styleUrls: ['./dashboard-rooms.component.scss']
})
export class DashboardRoomsComponent implements OnInit, OnChanges {

  protected readonly Object = Object;
  rooms: any;
  status: any;
  tasks: any;
  users: any;
  @Input() hotelId!: any;
  groupedRooms: { [key: string]: Room[] } = {};
  filteredRooms: { [key: string]: Room[] } = {};
  isMobile: boolean = false;
  isAssigning: boolean = false;
  isLoading: any;
  filter = {
    roomNumber: '',
    status: [] as string[],
    floor: [] as string[],
    assignedTo: [] as string[]
  };
  filtersVisible = false;



  constructor(private roomsService: RoomsService,
              private statusService: StatusService,
              private tasksService: TasksService,
              private usersService: UsersService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private assignRoomsService: AssignRoomsService,
              private snackBar: MatSnackBar,
              private roomTaskService: RoomTasksService
              ) {
  }


  ngOnInit(): void {
    this.loadData();
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.getFilteredGroupedRooms();
    }
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

        payload.room_ids = payload.room_ids.filter((room: string | number) => room !== 'selectAll');

        this.assignRoomsService.checkRoomConflicts(payload).subscribe(response => {
          if (response.conflictExists) {
            const confirmDialogRef = this.dialog.open(ConfirmOverwriteDialogComponent, {
              width: '400px',
              data: {message: response.message}
            });

            confirmDialogRef.afterClosed().subscribe(confirm => {
              if (confirm) {
                this.assignRoomsService.assignRooms(payload).subscribe({
                  next: (assignedRooms) => {
                    this.updateRoomCards(assignedRooms.assignedRooms);
                    this.loadRooms();
                    this.snackBar.open('Habitaciones asignadas con éxito ✅', 'Cerrar', {duration: 3000});
                  },
                  error: (error) => {
                    const msg = error.error?.error || 'Error al asignar habitaciones';
                    this.snackBar.open(msg, 'Cerrar', {duration: 5000});
                  }
                });
              } else {
                this.snackBar.open('La asignación de habitaciones ha sido cancelada', 'Cerrar', {duration: 5000});
              }
            });
          } else {
            this.assignRoomsService.assignRooms(payload).subscribe({
              next: (assignedRooms) => {
                this.updateRoomCards(assignedRooms.assignedRooms);
                this.loadRooms();
                this.snackBar.open('Habitaciones asignadas con éxito ✅', 'Cerrar', {duration: 3000});
              },
              error: (error) => {
                const msg = error.error?.error || 'Error al asignar habitaciones';
                this.snackBar.open(msg, 'Cerrar', {duration: 5000});
              }
            });
          }
        }, error => {
          this.snackBar.open('Error al verificar conflictos', 'Cerrar', {duration: 5000});
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
      if (result) {
        this.loadRooms();
      }
    });
  }

  private formatDate(date: any): string {
    if (typeof date === 'string') return date;
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().split('T')[0];
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

      this.getFilteredGroupedRooms();
    });
  }

  getFilteredGroupedRooms(): void {
    const filtered: { [key: string]: Room[] } = {};

    if (
      !this.filter.roomNumber &&
      this.filter.status.length === 0 &&
      this.filter.floor.length === 0 &&
      this.filter.assignedTo.length === 0
    ) {
      this.filteredRooms = {...this.groupedRooms};
      return;
    }

    Object.keys(this.groupedRooms).forEach(floor => {
      const rooms = this.groupedRooms[floor].filter((room: Room) => {
        return (
          (!this.filter.roomNumber || room.number.includes(this.filter.roomNumber)) &&
          (!this.filter.status.length || this.filter.status.includes(room.status)) &&
          (!this.filter.floor.length || this.filter.floor.includes(floor)) &&
          (!this.filter.assignedTo.length || this.filter.assignedTo.includes(room.assigned_to))
        );
      });

      if (rooms.length > 0) {
        filtered[floor] = rooms;
      }
    });

    this.filteredRooms = filtered;
    this.isFilteredRoomsEmpty()
  }

  isFilteredRoomsEmpty(): boolean {
    return Object.values(this.filteredRooms).every(roomArray => roomArray.length === 0);
  }

  clearFilters(): void {
    this.filter = {
      roomNumber: '',
      assignedTo: [],
      status: [],
      floor: []
    };
    this.getFilteredGroupedRooms();
  }

  isAnyFilterApplied(): boolean {
    return (
      this.filter.roomNumber !== '' ||
      this.filter.assignedTo.length > 0 ||
      this.filter.status.length > 0 ||
      this.filter.floor.length > 0
    );
  }

  assignTasks() {
    const dialogRef = this.dialog.open(AssignTasksDialogComponent, {
      width: '600px',
      data: {
        tasks: this.tasks,
        rooms: this.rooms
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formattedDateFrom = this.formatDate(result.start_date);
        const formattedDateTo = this.formatDate(result.end_date);

        if (new Date(formattedDateTo) < new Date(formattedDateFrom)) {
          this.snackBar.open('La fecha de fin no puede ser antes de la fecha de inicio', 'Cerrar', {duration: 5000});
          return;
        }

        const payload = {
          ...result,
          start_date: formattedDateFrom,
          end_date: formattedDateTo
        };

        payload.room_ids = payload.room_ids.filter((room: string | number) => room !== 'selectAll');
                this.roomTaskService.assignTasks(payload).subscribe({
                  next: (assignedRooms) => {
                    this.loadRooms();
                    this.snackBar.open('Habitaciones asignadas con éxito ✅', 'Cerrar', {duration: 3000});
                  },
                  error: (error) => {
                    const msg = error.error?.error || 'Error al asignar habitaciones';
                    this.snackBar.open(msg, 'Cerrar', {duration: 5000});
                  }
                });
              } else {
                this.snackBar.open('La asignación de habitaciones ha sido cancelada', 'Cerrar', {duration: 5000});
              }
            });
          }

}
