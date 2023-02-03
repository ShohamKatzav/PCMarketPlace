import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Deal } from '../models/deal';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${this.baseUrl}deals`);
  }

  create(model: any): Observable<any> {
    return this.http.post<Deal>(this.baseUrl + 'deals/create', model).pipe(
      map((deal: Deal) => {
        if (deal) {
          //localStorage.setItem('user', JSON.stringify(user));
          //this.currentUserSource$.next(user);
          console.log(deal)
        }
        return deal;
      })
    );
  }
}
