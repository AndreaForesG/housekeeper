import {Component, Input, OnInit} from '@angular/core';
import {RoomsService} from "../../services/rooms.service";

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
  @Input() hotelId!: any;
  groupedRooms: { [key: number]: any[] } = {};


  constructor(private roomsService: RoomsService) { }

  ngOnInit(): void {
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



  protected readonly Object = Object;
}
