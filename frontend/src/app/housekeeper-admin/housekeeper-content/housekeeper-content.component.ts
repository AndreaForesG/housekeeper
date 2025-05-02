import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";
import {RoomsService} from "../../services/rooms.service";
import {EmployeesTabComponent} from "../employees-tab/employees-tab.component";
import {StatusService} from "../../services/status.service";
import {TasksService} from "../../services/tasks.service";
import {CreateEmployeesComponent} from "../create-employees/create-employees.component";

@Component({
  selector: 'app-housekeeper-content',
  templateUrl: './housekeeper-content.component.html',
  styleUrls: ['./housekeeper-content.component.scss']
})
export class HousekeeperContentComponent implements OnInit {
  employees: any = [];
  status: any = [];
  displayedColumnsEmployees: string[] = ['name', 'email', 'role', 'actions'];
  displayedColumnsRooms: string[] = ['floor', 'number', 'actions'];
  displayedColumnsStatus: string[] = [ 'name', 'color', 'actions'];
  displayedColumnsTasks: string[] = [ 'name', 'actions'];
  roomDataSource = new MatTableDataSource<any>([]);
  dataSourceEmployees = new MatTableDataSource<any>([]);
  statusDataSource = new MatTableDataSource<any>([]);
  tasksDataSource = new MatTableDataSource<any>([]);
  hotelLogued: any;
  rooms: any;
  tasks: any;
  isLoading: boolean = true;
  @ViewChild('paginatorRooms') paginatorRooms!: MatPaginator;
  @ViewChild('paginatorEmployees') paginatorEmployees!: MatPaginator;
  @ViewChild('paginatorStatus') paginatorStatus!: MatPaginator;
  @ViewChild('paginatorTasks') paginatorTasks!: MatPaginator;
  @Output() editEmployeeRequest = new EventEmitter<number>();


  constructor(private userService: UsersService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private roomsService: RoomsService,
              private statusService: StatusService,
              private tasksService: TasksService
              ) { }

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.hotelLogued = data.hotel;
      this.loadEmployees();
      this.loadRooms();
      this.loadStatus();
      this.loadTasks();
      this.isLoading = false;
    })
  }

  loadEmployees() {
    this.userService.getEmployeesByHotel(this.hotelLogued).subscribe(employees => {
      this.employees = employees.filter((employee: { role_id: any }) => employee.role_id != null);
      this.dataSourceEmployees.data = this.employees;
      this.dataSourceEmployees.paginator = this.paginatorEmployees;
      }
    )
  }

  deleteEmployee(employeeId: number) {
    this.userService.deleteEmployee(employeeId).subscribe(
      () => {
        this.notificationService.showSuccess('Emplado eliminado con éxito!');
        this.loadEmployees();
      },
        (error: any) => {
        this.notificationService.showError('Error al eliminar la habitación');
      }
    );
  }

  editEmployee(id: number) {
    this.editEmployeeRequest.emit(id);
  }

  loadRooms() {
    if (this.hotelLogued) {
      this.roomsService.getRoomsByHotel(this.hotelLogued).subscribe(rooms => {
        this.rooms = rooms;
        this.roomDataSource.data = rooms;
        this.roomDataSource.paginator = this.paginatorRooms;
      });
    }
  }

  deleteRoom(roomId: number) {
    this.roomsService.deleteRoom(roomId).subscribe(
      () => {
        this.notificationService.showSuccess('Habitación eliminada con éxito!');
        this.loadRooms();
      },
      (error: any) => {
        this.notificationService.showError('Error al eliminar la habitación');
      }
    );
  }




  loadStatus() {
    if (this.hotelLogued) {
      this.statusService.getStatusByHotel(this.hotelLogued).subscribe(status => {
        this.status = status;
        this.statusDataSource.data = status;
        this.statusDataSource.paginator = this.paginatorStatus;
      });
    }
  }

  deleteStatus(statusId: number) {
    this.statusService.deleteStatus(statusId).subscribe(
      () => {
        this.notificationService.showSuccess('Estado eliminado con éxito!');
        this.loadStatus();
      },
      (error: any) => {
        this.notificationService.showError('Error al eliminar el estado');
      }
    );
  }

  loadTasks() {
    if (this.hotelLogued) {
      this.tasksService.getTasksByHotel(this.hotelLogued).subscribe(tasks => {
        this.tasks = tasks;
        this.tasksDataSource.data = tasks;
        this.tasksDataSource.paginator = this.paginatorTasks;
      });
    }
  }

  deleteTask(taskId: number) {
    this.tasksService.deleteTasks(taskId).subscribe(
      () => {
        this.notificationService.showSuccess('Tarea eliminada con éxito!');
        this.loadTasks();
      },
      (error: any) => {
        this.notificationService.showError('Error al eliminar la tarea');
      }
    );
  }
}
