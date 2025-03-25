import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

export interface employeeDto {
  name: string;
  email:string;
  password: string;
  role: string;
  hotel_id:number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl + 'users';

  constructor(private http: HttpClient) { }

  createEmployees(employeeData: employeeDto) {
    return this.http.post<any>(this.apiUrl, employeeData);
  }


  getEmployeesByHotel(hotelId: number): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}?hotel_id=${hotelId}`, { headers });
  }


  deleteEmployee(employeeId: number) {
    return this.http.delete<any>(`${this.apiUrl}/${employeeId}`);
  }
}
