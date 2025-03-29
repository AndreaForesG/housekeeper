import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private apiUrl = environment.apiUrl + 'statuses';


  constructor(private http : HttpClient) { }

  createStatus(statusData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, statusData);
  }

  getStatusByHotel(hotelId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/hotel/${hotelId}`);
  }

  deleteStatus(statusId: number) {
    return this.http.delete<any>(`${this.apiUrl}/${statusId}`);
  }
}
