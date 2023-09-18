import { createAction, props } from '@ngrx/store';
import { Category } from 'src/app/models/category';

export const addCategory = createAction(
  '[Category] Add Category',
  props<{ category: Category }>()
);

export const removeCategory = createAction(
  '[Category] Remove Category',
  props<{ id: number }>()
);

export const editCategory = createAction(
  '[Category] Edit Category',
  props<{ category: Category }>()
);

export const loadCategories = createAction('[Category] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Category] Category Load Success',
  props<{ categories: Category[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Category] Category Load Failure',
  props<{ error: string }>()
);

export const saveCategories = createAction(
  '[Category] Save Categories',
  props<{ categories: Category[] }>()
);