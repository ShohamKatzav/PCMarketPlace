import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../state/app.state";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Category } from "../models/category";
import { selectAllCategories } from "../state/categories/category.selectors";
import * as fromCategoryActions from "../state/categories/category.actions";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private store = inject(Store<AppState>);
  private baseUrl = environment.apiUrl;
  private storeInitialised = false;

  constructor() {
    this.refreshCategories();
  }

  getCategories(): Observable<Category[]> {
    return this.store.select(selectAllCategories);
  }

  private refreshCategories() {
    if (this.storeInitialised) return;

    this.http.get<Category[]>(`${this.baseUrl}category`).subscribe({
      next: (categories) => {
        this.store.dispatch(fromCategoryActions.loadCategoriesSuccess({ categories }));
        this.storeInitialised = true;
      }
    });
  }

  addCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}category/create`, { name }).pipe(
      tap(category => this.store.dispatch(fromCategoryActions.addCategory({ category })))
    );
  }

  removeCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}category/${id}`).pipe(
      tap(() => this.store.dispatch(fromCategoryActions.removeCategory({ id })))
    );
  }

  editCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}category`, category).pipe(
      tap(() => this.store.dispatch(fromCategoryActions.editCategory({ category })))
    );
  }

  saveCategoriesToStore(categories: Category[]) {
    this.store.dispatch(fromCategoryActions.loadCategoriesSuccess({ categories }));
    this.storeInitialised = true;
  }
}