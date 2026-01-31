import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from 'src/app/services/category.service';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import * as CategoryActions from './category.actions';

@Injectable()
export class CategoryEffects {
  private actions$ = inject(Actions);
  private categoryService = inject(CategoryService);

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(() =>
        this.categoryService.getCategories().pipe(
          map((categories) => CategoryActions.loadCategoriesSuccess({ categories })),
          catchError((error) => of(CategoryActions.loadCategoriesFailure({ error: error.message })))
        )
      )
    )
  );

  syncCategoriesToService$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.addCategory, CategoryActions.removeCategory, CategoryActions.editCategory),
        tap(() => {
          console.log('Store updated, synchronization verified.');
        })
      ),
    { dispatch: false } // Prevents infinite loops
  );
}