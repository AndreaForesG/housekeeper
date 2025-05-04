import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomStatusService {

  private apiUrl = environment.apiUrl + 'room-status';

  constructor(private http: HttpClient) { }

  changeRoomStatus(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-status`, data);
  }
}
