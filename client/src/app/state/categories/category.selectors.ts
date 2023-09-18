import { createSelector } from '@ngrx/store';
import { CategoryState } from './category.reducer';
import { AppState } from '../app.state';

export const selectCategoryState  = (state: AppState) => state.categories;
export const selectAllCategories = createSelector(
  selectCategoryState ,
  (state: CategoryState) => state.categories
)