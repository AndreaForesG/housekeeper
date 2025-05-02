import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  private apiUrl = environment.apiUrl + 'plans';

  constructor(private http: HttpClient) {
  }

  getAllPlans() {
    return this.http.get(this.apiUrl);
  }
}
