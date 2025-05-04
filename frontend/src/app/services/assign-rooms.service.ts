import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssignRoomsService {

  private apiUrl = environment.apiUrl + 'assign-rooms';

  constructor(private http: HttpClient) {
  }

  assignRooms(data: {
    user_id: number;
    room_ids: number[];
    date_from: string;
    date_to: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
