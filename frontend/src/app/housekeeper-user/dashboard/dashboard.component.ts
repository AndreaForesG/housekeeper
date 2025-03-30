import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  date: string = "";
  userName: string = "";
  hotelId: any;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.dateCurrently();
    this.getLoggedInUser();
  }


  dateCurrently() {
    const current = new Date();
    const day = current.getDate().toString().padStart(2, '0');
    const month = (current.getMonth() + 1).toString().padStart(2, '0');
    const year = current.getFullYear();
    this.date = `${day}/${month}/${year}`;
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser().subscribe(data => {
      console.log('Response data:', data);
      this.hotelId = data.hotel;
      this.userName = data.user.name;
    })
  }


  logout() {
    this.authService.logout();
  }
}
