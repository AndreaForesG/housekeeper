import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateEmployeesComponent} from "../create-employees/create-employees.component";
import {MatPaginator} from "@angular/material/paginator";
import {HousekeeperContentComponent} from "../housekeeper-content/housekeeper-content.component";
import {AuthService} from "../../services/auth.service";
import {CreateRoomsComponent} from "../create-rooms/create-rooms.component";
import {CreateStatusComponent} from "../create-status/create-status.component";
import {CreateTasksComponent} from "../create-tasks/create-tasks.component";

@Component({
  selector: 'app-housekeeper',
  templateUrl: './housekeeper.component.html',
  styleUrls: ['./housekeeper.component.scss']
})
export class HousekeeperComponent implements OnInit {

  isExpanded = true;
  hotelLogued: any;
  hotelName: any;
  @ViewChild(HousekeeperContentComponent) housekeeperContent!: HousekeeperContentComponent;

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private authService: AuthService,
              ) { }



  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.titleService.setTitle(data.title);
    });
    this.getLoggedInUser();
  }

getLoggedInUser() {
  this.authService.getLoggedInUser().subscribe(data => {
    console.log('Response data:', data);
    this.hotelLogued = data.hotel;
    this.hotelName = data.user.hotel.name;
    console.log(this.hotelLogued);
  })
}

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  createEmployees() {
    const dialogRef = this.dialog.open(CreateEmployeesComponent, {
      width: '400px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
     if(result) {
        this.housekeeperContent.loadEmployees();
     }
    });
  }


  logout() {
    this.authService.logout();

  }

  createRooms() {
    const dialogRef = this.dialog.open(CreateRoomsComponent, {
      width: 'auto',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        hotel_id : this.hotelLogued
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.housekeeperContent.loadEmployees();
      }
    });
  }

  createStatus() {
    const dialogRef = this.dialog.open(CreateStatusComponent, {
      width: 'auto',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        hotel_id : this.hotelLogued
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.housekeeperContent.loadStatus();
      }
    });
  }

  createTasks() {
    const dialogRef = this.dialog.open(CreateTasksComponent, {
      width: 'auto',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        hotel_id : this.hotelLogued
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.housekeeperContent.loadTasks();
      }
    });
  }
}
