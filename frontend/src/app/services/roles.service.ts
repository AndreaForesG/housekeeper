import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = environment.apiUrl + 'roles';

  constructor(private http: HttpClient) { }

  getAllRoles() {
    return this.http.get(this.apiUrl);
  }
}
