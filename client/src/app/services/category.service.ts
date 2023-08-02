import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get<Category[]>(this.baseUrl + 'category');
  }
  addCategory(categoryToAdd: string): Observable<any> {
    return this.http.post<Category>(this.baseUrl + 'category/create', {"name":categoryToAdd}).pipe(
      map((response: any) => {
      }))
  }
  removeCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}category/${categoryId}`);
  }

  editCategory(category: any): Observable<any> {
    return this.http.put<Category>(this.baseUrl + 'category', category);
  }

}
