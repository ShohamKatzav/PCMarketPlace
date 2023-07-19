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

  constructor(private http: HttpClient) { }

  getDeal(dealId: number): Observable<Deal> {
    return this.http.get<Deal>(`${this.baseUrl}deals/GetDeal/${dealId}`);
  }

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${this.baseUrl}deals`);
  }
  
  getDealsForUser(userId: number): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${this.baseUrl}deals/GetDealsForUser/${userId}`);
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
}
