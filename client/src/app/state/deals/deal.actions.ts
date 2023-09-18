import { createAction, props } from '@ngrx/store';
import { Deal } from 'src/app/models/deal';

export const addDeal = createAction(
  '[Deal] Add Deal',
  props<{ deal: Deal, category: string }>()
);
export const removeDeal = createAction(
  '[Deal] Remove Deal',
  props<{ dealId: number, pageCategory: string }>()
);
export const editDeal = createAction(
  '[Deal] Edit Deal',
  props<{ deal: Deal, pageCategory: string}>()
);

export const addDealFromAvailableDeals = createAction(
  '[Deal] Add Deal',
  props<{ deal: Deal, category: string }>()
);
export const removeDealFromAvailableDeals = createAction(
  '[Deal] Remove Deal From Available Deals',
  props<{ dealId: number, pageCategory: string }>()
);
export const editDealFromAvailableDeals = createAction(
  '[Deal] Edit Deal From Available Deals',
  props<{ deal: Deal, pageCategory: string}>()
);

export const loadPageAvailableDeals = createAction(
  '[Deal] Load Page Available Deals',
  props<{ userId: number, pageNumber: number, tableSize: number, category: string }>()
);

export const loadAvailableDealsSuccessfully = createAction(
  '[Deal] Load Available Deals Successfully',
  props<{ deals: Deal[], pageNumber: number , category: string, totalCount: number }>()
);

export const loadPageCurrentUserDeals = createAction(
  '[Deal] Load Page Current Users Deals',
  props<{ userId: number, pageNumber: number, tableSize: number, category: string }>()
);

export const loadCurrentUserDealsSuccessfully = createAction(
  '[Deal] Load Current Users Deals Successfully',
  props<{ deals: Deal[], pageNumber: number , category: string, totalCount: number }>()
);

export const loadDealsFailure = createAction(
  '[Deal] Load Page Deals',
  props<{ error: string }>()
);

export const setCountForCategoryInCurrentUser = createAction(
  '[Deal] Set Count For Category Current User',
  props<{ category: string, count: number }>()
);
export const setCountForCategoryInAvailable = createAction(
  '[Deal] Set Count For Category Available',
  props<{ category: string, count: number }>()
);
