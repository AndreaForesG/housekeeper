import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LogModel} from "../models/log.model";

@Injectable({
  providedIn: 'root'
})
export class RoomTaskLogsService {

  private apiUrl = environment.apiUrl + 'room-task-logs';

  constructor(private http: HttpClient) { }

  submitRoomTaskLog(data: {
    room_task_id: string;
    task_id: number;
    user_id: number;
    is_done: boolean;
    observation: string;
    completed_at: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getLogsForHotel(hotelId: number): Observable<LogModel[]> {
    return this.http.get<LogModel[]>(`${this.apiUrl}/logs/${hotelId}`);
  }
}
