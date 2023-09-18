import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';


import { Store } from '@ngrx/store';

import { selectAllCategories } from '../state/categories/category.selectors';
import * as fromCategoryActions from '../state/categories/category.actions';
import { AppState } from '../state/app.state';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl = environment.apiUrl;
  private storeInitialised = false;

  constructor(private http: HttpClient,
    private store: Store<AppState>) { 
      this.getCategories().subscribe();
    }

  addCategory(categoryToAdd: string): Observable<any> {
    return this.http.post<Category>(this.baseUrl + 'category/create', { "name": categoryToAdd }).pipe(
      tap(category => {
        this.store.dispatch(fromCategoryActions.addCategory({ category }));
      }))
  }
  removeCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}category/${id}`).pipe(
      tap(() => {
        this.store.dispatch(fromCategoryActions.removeCategory({ id }));
      }))
  }

  editCategory(category: any): Observable<any> {
    return this.http.put<Category>(this.baseUrl + 'category', category).pipe(
      tap(() => {
        this.store.dispatch(fromCategoryActions.editCategory({ category }));
      }))
  }

  
  getCategories(): Observable<Category[]> {
    if (!this.storeInitialised) {
      const categories$ = this.http.get<Category[]>(this.baseUrl + 'category').pipe(
        tap((categories) => {
          this.store.dispatch(fromCategoryActions.loadCategoriesSuccess({ categories }));
          this.storeInitialised = true;
        }),
        shareReplay(1) // Cache the result and replay it to new subscribers
      );
      return categories$;
    } else {
      return this.store.select(selectAllCategories);
    }
  }
  async saveCategoriesToStore(categories: Category[]) {
    await this.store.dispatch(fromCategoryActions.saveCategories({ categories }));
  }
}
