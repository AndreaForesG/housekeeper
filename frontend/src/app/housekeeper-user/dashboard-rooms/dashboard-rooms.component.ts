import {Component, Input, OnInit} from '@angular/core';
import {RoomsService} from "../../services/rooms.service";
import {StatusService} from "../../services/status.service";
import {TasksService} from "../../services/tasks.service";
import {UsersService} from "../../services/users.service";

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

  rooms: any;
  status: any;
  tasks: any;
  users: any;
  @Input() hotelId!: any;
  groupedRooms: { [key: number]: any[] } = {};


  constructor(private roomsService: RoomsService,
              private statusService: StatusService,
              private tasksService: TasksService,
              private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadData();
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

    this.loadRooms()
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







  protected readonly Object = Object;
}
