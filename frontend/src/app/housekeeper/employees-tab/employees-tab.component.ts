import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {UsersService} from "../../services/users.service";
import {MatTableDataSource} from "@angular/material/table";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-employees-tab',
  templateUrl: './employees-tab.component.html',
  styleUrls: ['./employees-tab.component.scss']
})
export class EmployeesTabComponent implements OnInit {

  displayedColumnsEmployees: string[] = ['name', 'email', 'role', 'actions'];
  @ViewChild('paginatorEmployees') paginatorEmployees!: MatPaginator;
  employees: any;
  dataSourceEmployees = new MatTableDataSource<any>([]);
  @Input() hotelLogued!: any;

  constructor(private userService: UsersService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadEmployees();
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

}
