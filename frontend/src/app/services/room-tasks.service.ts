import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomTasksService {

  private apiUrl = environment.apiUrl + 'room-tasks/assign';

  constructor(private http: HttpClient) { }

  assignTasks(data: {
    task_id: number;
    room_ids: number[];
    start_date: string;
    end_date: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
