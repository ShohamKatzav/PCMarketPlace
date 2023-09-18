import { createReducer, on } from '@ngrx/store';
import {
  addCategory,
  removeCategory,
  loadCategories,
  loadCategoriesSuccess,
  loadCategoriesFailure,
  editCategory,
} from './category.actions';
import { Category } from 'src/app/models/category';

export interface CategoryState {
  categories: Category[];
  error: string;
  status: "pending" | "loading" | "error" | "success";
  
}

export const initialState: CategoryState = {
  categories: [],
  error: null,
  status: "pending",
};

export const categoryReducer = createReducer(
  // Supply the initial state
  initialState,
  // Add the new category to the categories array
  on(addCategory, (state, { category }) => ({
    ...state,
    categories: [...state.categories,  category ],
  })),
  // Remove the category from the categories array
  on(removeCategory, (state, { id }) => ({
    ...state,
    categories: state.categories.filter(category => category.id !== id),
  })),
  on(editCategory, (state, { category }) => ({
    ...state,
    categories: state.categories.map(oldCategory => oldCategory.id == category.id ? category : oldCategory),
  })),
  // Trigger loading the categories
  on(loadCategories, (state) => ({ ...state, status: "loading" as const})),
  // Handle successfully loaded categories
  on(loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories: categories,
    error: null,
    status: "success" as const,
  })),
  // Handle categories load failure
  on(loadCategoriesFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: "error" as const,
  })),
);