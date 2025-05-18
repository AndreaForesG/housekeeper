import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RoomsService} from "../../services/rooms.service";
import {StatusService} from "../../services/status.service";
import {TasksService} from "../../services/tasks.service";
import {UsersService} from "../../services/users.service";
import {AssignRoomsDialogComponent} from "../assign-rooms-user-dialog/assign-rooms-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AssignRoomsService} from "../../services/assign-rooms.service";
import {AssignRoomsStatusComponent} from "../assign-rooms-status-dialog/assign-rooms-status.component";
import {ConfirmOverwriteDialogComponent} from "../confirm-overwrite-dialog/confirm-overwrite-dialog.component";
import {AssignTasksDialogComponent} from "../assign-room-tasks-dialog/assign-tasks-dialog.component";
import {RoomTasksService} from "../../services/room-tasks.service";
import {CompleteTasksComponent} from "../complete-tasks/complete-tasks.component";
import {ShowLogsComponent} from "../show-logs/show-logs.component";
import {NotificationService} from "../../services/notification.service";
import {OpenSituationComponent} from "../../housekeeper-admin/open-situation/open-situation.component";

export interface Room {
  id: number;
  hotel_id: number;
  number: string;
  floor: number;
  status: string;
  status_color: string;
  assigned_to: string;
  user_id?:number;
  tasks: Tasks[];
}

export interface Tasks {
  task_id: number;
  task_name: string;
  start_date: string;
  end_date: string;
  task_color: string;
  room_task_id: string;
  log?: RoomTaskLog;
}

export interface RoomTaskLog {
  task_id: number;
  room_task_id: number;
  is_done: boolean;
  observation: string;
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
  @Input() userId!: number;
  @Input() dataUser!: any;
  groupedRooms: { [key: string]: Room[] } = {};
  filteredRooms: { [key: string]: Room[] } = {};
  isLoading: any;
  filter = {
    roomNumber: '',
    status: [] as string[],
    floor: [] as string[],
    assignedTo: [] as string[],
    tasks: [] as number[]
  };
  filtersVisible = false;
  isHousekeeper: boolean = false;
  dataHotel: any;



  constructor(private roomsService: RoomsService,
              private statusService: StatusService,
              private tasksService: TasksService,
              private usersService: UsersService,
              private dialog: MatDialog,
              private assignRoomsService: AssignRoomsService,
              private notificationService: NotificationService,
              private roomTaskService: RoomTasksService
              ) {
  }


  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.getFilteredGroupedRooms();
    }
  }

  getIsHousekeeper() {
    if(this.dataUser.role_id == 3) {
      this.isHousekeeper = true;
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
      if(this.dataUser.role_id !== 3 ) {
       this.users =  this.users.filter((u:any) => u.id == this.userId);
      }
    })
    this.getIsHousekeeper();
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
          this.notificationService.showError('La fecha de fin no puede ser antes de la fecha de inicio');
          return;
        }

        const workDate = new Date();
        const dateFrom = new Date(formattedDateFrom);
        const dateTo = new Date(formattedDateTo);

        workDate.setHours(0, 0, 0, 0);

        if (dateTo < dateFrom) {
          this.notificationService.showError('La fecha de fin no puede ser antes de la fecha de inicio');
          return;
        }

        if (dateFrom < workDate) {
          this.notificationService.showError('La fecha de inicio no puede ser menor a la fecha de trabajo');
          return;
        }

        if (dateTo < workDate) {
          this.notificationService.showError('La fecha de fin no puede ser menor a la fecha de trabajo');
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
                    this.notificationService.showSuccess('Habitaciones asignadas con éxito ✅');
                  },
                  error: (error) => {
                    const msg = error.error?.error || 'Error al asignar habitaciones';
                    this.notificationService.showError(msg);
                  }
                });
              } else {
                this.notificationService.showError('La asignación de habitaciones ha sido cancelada');
              }
            });
          } else {
            this.assignRoomsService.assignRooms(payload).subscribe({
              next: (assignedRooms) => {
                this.updateRoomCards(assignedRooms.assignedRooms);
                this.loadRooms();
                this.notificationService.showSuccess('Habitaciones asignadas con éxito ✅');
              },
              error: (error) => {
                const msg = error.error?.error || 'Error al asignar habitaciones';
                this.notificationService.showError(msg);
              }
            });
          }
        }, error => {
          this.notificationService.showError('Error al verificar conflictos');
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
      if(this.dataUser.role_id !== 3) {
        this.rooms = this.rooms.filter((r:any) => r.user_id == this.userId);
      }

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
      this.filter.assignedTo.length === 0 &&
      this.filter.tasks.length === 0
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
          (!this.filter.assignedTo.length || this.filter.assignedTo.includes(room.assigned_to)) &&
          (!this.filter.tasks.length ||
            room.tasks.some(task => this.filter.tasks.includes(task.task_id)))
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
      floor: [],
      tasks: []
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
          this.notificationService.showSuccess('La fecha de fin no puede ser antes de la fecha de inicio');
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
                    this.notificationService.showSuccess('Habitaciones asignadas con éxito ✅');
                  },
                  error: (error) => {
                    const msg = error.error?.error || 'Error al asignar habitaciones';
                    this.notificationService.showError(msg);
                  }
                });
              } else {
                this.notificationService.showError('La asignación de habitaciones ha sido cancelada');
              }
            });
          }
  completeTasks() {
    const dialogRef = this.dialog.open(CompleteTasksComponent, {
      width: '95vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      data: {
        rooms: this.rooms,
        userId: this.userId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRooms();
      }
    });
  }

  showLogs() {
    const dialogRef = this.dialog.open(ShowLogsComponent, {
      width: '95vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      data: {
        hotelId: this.hotelId,
        dataUser: this.dataUser
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRooms();
      }
    });
  }

  showSituation() {
    this.roomsService.getRoomsByHotel(this.hotelId).subscribe((result: any) => {
      this.dataHotel = result;

      const dialogRef = this.dialog.open(OpenSituationComponent, {
        width: '90vw',
        maxWidth: 'none',
        data : {
          dataHotel : this.dataHotel,
          hotelId: this.hotelId
        }
      });
    });
  }
}
