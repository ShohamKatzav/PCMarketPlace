import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    const categories = JSON.parse(localStorage.getItem("categories"));
    if(categories)
      return of(categories);
    else
    {
      const categories$ = this.http.get<Category[]>(this.baseUrl + 'category').pipe(
        tap(categories => {
          localStorage.setItem("categories", JSON.stringify(categories));
        })
      );
      return categories$;
    }
  }
  addCategory(categoryToAdd: string): Observable<any> {
    return this.http.post<Category>(this.baseUrl + 'category/create', {"name":categoryToAdd});
  }
  removeCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}category/${categoryId}`);
  }

  editCategory(category: any): Observable<any> {
    return this.http.put<Category>(this.baseUrl + 'category', category);
  }

}
