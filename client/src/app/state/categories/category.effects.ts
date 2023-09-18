import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from 'src/app/services/category.service';
import { of, from } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAllCategories } from './category.selectors';
import { AppState } from '../app.state';
import * as CategoryActions from './category.actions';

@Injectable()
export class CategoryEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private categoryService: CategoryService
  ) { }

  // Run this code when a loadTodos action is dispatched
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      mergeMap(() => {
        return this.categoryService.getCategories().pipe(
          map((categories) => CategoryActions.loadCategoriesSuccess({ categories })),
          catchError((error) =>
            of(CategoryActions.loadCategoriesFailure({ error: error.message }))
          )
        );
      })
    )
  );

  // Run this code when the addCategory/removeCategory/editCategory action is dispatched
  saveCategories$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CategoryActions.addCategory, CategoryActions.removeCategory, CategoryActions.editCategory),
        withLatestFrom(this.store.select(selectAllCategories)),
        switchMap(([action, categories]) =>
          from(this.categoryService.saveCategoriesToStore(categories)).pipe(
            map(() => CategoryActions.loadCategories()), // Dispatch loadCategories action
            catchError((error) => of(CategoryActions.loadCategoriesFailure({ error })))
          )
        )
      ));
}