import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) {}

  downloadInvoice(userData: any): Observable<Blob> {
     return this.http.post(`${this.apiUrl}invoice/download`, userData, { responseType: 'blob' });
  }


  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}login`, { email, password }).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user_type', res.user_type);

        if (res.user_type === "hotel_admin") {
          this.router.navigate(['/app']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        this.notificationService.showError('Error al iniciar sesión');
      }
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword,
      planId: userData.planId,
      paymentIntentId: userData.paymentIntentId,

    });
  }


  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    this.router.navigate(['/login']);
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  getLoggedInUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}user`, { headers });
  }


}
