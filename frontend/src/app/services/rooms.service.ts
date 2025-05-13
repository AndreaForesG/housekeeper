import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  private apiUrl = environment.apiUrl + 'rooms';


  constructor(private http : HttpClient) { }

  importRooms(file: File, hotelId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('hotel_id', hotelId.toString());

    return this.http.post(`${this.apiUrl}/import`, formData);
  }

  createRoom(roomData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, roomData);
  }

  getRoomsByHotel(hotelId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/hotel/${hotelId}`);
  }

  getRoomsByHotelAndDate(hotel_id: number, date: string) {
    return this.http.get(`${this.apiUrl}/${hotel_id}/date/${date}`);
  }


  deleteRoom(roomId: number) {
    return this.http.delete<any>(`${this.apiUrl}/${roomId}`);
  }
}
