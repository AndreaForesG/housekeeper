import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private apiUrl = environment.apiUrl + 'tasks';


  constructor(private http: HttpClient) { }

  createTask(tasksData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, tasksData);
  }

  getTasksByHotel(hotelId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/hotel/${hotelId}`);
  }

  deleteTasks(taskId: number) {
    return this.http.delete<any>(`${this.apiUrl}/${taskId}`);
  }
}
