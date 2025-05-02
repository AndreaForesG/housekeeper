import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createPaymentIntent(data: { amount: number, currency: string, planId: number }): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}create-payment-intent`, data);
  }


}
