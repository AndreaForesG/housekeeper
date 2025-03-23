import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

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
}
