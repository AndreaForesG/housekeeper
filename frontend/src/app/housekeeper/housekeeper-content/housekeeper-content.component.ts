import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-housekeeper-content',
  templateUrl: './housekeeper-content.component.html',
  styleUrls: ['./housekeeper-content.component.scss']
})
export class HousekeeperContentComponent implements OnInit, AfterViewInit {
  employees: any = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  hotelLogued: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private userService: UsersService,
              private notificationService: NotificationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  ngAfterViewInit() {
    if (this.dataSource.data.length > 0) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.hotelLogued = data.hotel;
      this.loadEmployees();
    })
  }


  loadEmployees() {
    this.userService.getEmployeesByHotel(this.hotelLogued).subscribe(employees => {
      this.employees = employees.filter((employee: { role_id: any }) => employee.role_id != null);
      this.dataSource.data = this.employees;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
      console.log(this.employees);
      }
    )
  }

  deleteEmployee(employeeId: number) {
    this.userService.deleteEmployee(employeeId).subscribe(
      () => {
        this.notificationService.showSuccess('Empleado eliminado con éxito!');
        this.loadEmployees();
      },
        (error: any) => {
        this.notificationService.showError('Error al eliminar el empleado');
      }
    );
  }

}
