import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Deal } from '../models/deal';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  baseUrl = environment.apiUrl;

  private readonly dealKey = 'deal_data';

  constructor(private http: HttpClient) { }


  setSavedDeal(deal: Deal) {
    sessionStorage.setItem(this.dealKey, JSON.stringify(deal));
  }

  getSavedDeal(): Deal | null {
    const dealData = sessionStorage.getItem(this.dealKey);
    return dealData ? JSON.parse(dealData) : null;
  }

  getDeal(dealId: number): Observable<Deal> {
    return this.http.get<Deal>(`${this.baseUrl}deals/GetDeal/${dealId}`);
  }

  getDeals(userId: number, currentPage: number, tableSize: number): Observable<{ deals: Deal[], totalCount: number }> {
    const queryParams = { "userId": userId, "currentPage": currentPage, "tableSize": tableSize };
    return this.http.get<{ deals: Deal[], totalCount: number }>(`${this.baseUrl}deals`, { params: queryParams}).pipe(
      map(response => {
        const deals = response.deals;
        const totalCount = response.totalCount;;
        return { deals, totalCount };
      })
    );
  }

  getDealsForUser(userId: number, currentPage: number, tableSize: number): Observable<{ deals: Deal[], totalCount: number }> {
    const queryParams = { "userId": userId, "currentPage": currentPage, "tableSize": tableSize };
    return this.http.get<{ deals: Deal[], totalCount: number }>(`${this.baseUrl}deals/GetDealsForUser/${userId}`, { params: queryParams }).pipe(
      map(response => {
        const deals = response.deals;
        const totalCount = response.totalCount;;
        return { deals, totalCount };
      })
    );
  }

  getProductsForDeal(dealId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}deals/GetProductsForDeal/${dealId}`);
  }

  create(model: any): Observable<any> {
    return this.http.post<Deal>(this.baseUrl + 'deals/create', model).pipe(
      map((deal: Deal) => {
        return deal;
      })
    );
  }

  edit(model: any): Observable<any> {
    return this.http.put<Deal>(this.baseUrl + 'deals', model).pipe(
      map((deal: Deal) => {
        return deal;
      })
    );
  }

  deleteDeal(dealId: number) {
    return this.http.delete(`${this.baseUrl}deals/delete-deal/${dealId}`);
  }

  deletePhoto(productId: number) {
    return this.http.delete(`${this.baseUrl}deals/delete-photo/${productId}`);
  }

  // Used for Stripe External page
  // checkoutDeal(dealId: number): Observable<any>{
  //   return this.http.post(`${this.baseUrl}deals/checkout`, dealId);
  // }

  checkoutDeal(dealId: number, paymentIntentId: string ,paymentMethodId: string): Observable<any>{
    const body = { dealId,paymentIntentId,paymentMethodId };
    return this.http.put(`${this.baseUrl}deals/checkout`, body);
  }

  getPublisableKey(): Observable<any>{
    return this.http.get(`${this.baseUrl}deals/publishable-key`);
  }

  getSecretKey(dealId: number): Observable<any>{
    return this.http.post(`${this.baseUrl}deals/secret-key`, dealId);
  }
  
}
