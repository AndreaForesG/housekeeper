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

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}?hotel_id=${hotelId}`, { headers });
  }

  getEmployeeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteEmployee(employeeId: number) {
    return this.http.delete<any>(`${this.apiUrl}/${employeeId}`);
  }
}
