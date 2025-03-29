import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";
import {RoomsService} from "../../services/rooms.service";
import {EmployeesTabComponent} from "../employees-tab/employees-tab.component";

@Component({
  selector: 'app-housekeeper-content',
  templateUrl: './housekeeper-content.component.html',
  styleUrls: ['./housekeeper-content.component.scss']
})
export class HousekeeperContentComponent implements OnInit, AfterViewInit {
  employees: any = [];
  displayedColumnsEmployees: string[] = ['name', 'email', 'role', 'actions'];
  displayedColumnsRooms: string[] = ['floor', 'number', 'actions'];
  roomDataSource = new MatTableDataSource<any>([]);
  dataSourceEmployees = new MatTableDataSource<any>([]);
  hotelLogued: any;
  rooms: any;
  isLoading: boolean = true;
  @ViewChild('paginatorRooms') paginatorRooms!: MatPaginator;
  @ViewChild('paginatorAnother') paginatorEmployees!: MatPaginator;
  @ViewChild(EmployeesTabComponent) employeesTab!: EmployeesTabComponent;

  constructor(private userService: UsersService,
              private notificationService: NotificationService,
              private authService: AuthService,
              private roomsService: RoomsService,
              ) { }

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  ngAfterViewInit() {
    if (this.dataSourceEmployees.data.length > 0) {
      this.dataSourceEmployees.paginator = this.paginatorEmployees;
    }
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.hotelLogued = data.hotel;
      this.loadEmployees();
      this.loadRooms();
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
        this.notificationService.showSuccess('Habitación eliminada con éxito!');
        this.loadEmployees();
      },
        (error: any) => {
        this.notificationService.showError('Error al eliminar la habitación');
      }
    );
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
        this.notificationService.showSuccess('Empleado eliminado con éxito!');
        this.loadRooms();
      },
      (error: any) => {
        this.notificationService.showError('Error al eliminar el empleado');
      }
    );
  }
}
