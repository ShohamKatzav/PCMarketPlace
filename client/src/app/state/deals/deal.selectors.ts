import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { DealState } from './deal.reducer';
import { Deal } from 'src/app/models/deal';

export const selectDealState = (state: AppState) => state.deals;

export const selectTotalAvailableDealsCount = (category: string) => createSelector(
  selectDealState,
  (state: DealState) => (
    state.availableDealsTotalCountPerPage[category]
  )
);

  export const selectCachedForPage = (pageNumber: string, listType: string = "My Deals") =>
  createSelector(
    selectDealState,
    (state: DealState) => (
      listType == "My Deals" ? 
      state.cachedCurrentUserDeals[pageNumber] || [] :
      state.cachedAvailableDeals[pageNumber] || []
    )
  );

export const selectTotalDealsCount = (category: string, listType: string = "My Deals") => createSelector(
  selectDealState,
  (state: DealState) => (
    listType == "My Deals" ? 
    state.currentUserDealsTotalCountPerPage[category] :
    state.availableDealsTotalCountPerPage[category]
  )
);
  
  export const selectCachedDeals = (listType: string = "My Deals") =>
  createSelector(
    selectDealState,
    (state: DealState) => (
      listType === "My Deals" ? state.cachedCurrentUserDeals || []
       : state.cachedAvailableDeals || []
    )
  );

  export const getAllPagesWithCategory = (category: string, listType: string = "My Deals") =>
  createSelector(
    selectDealState,
    (state: DealState) => {
      const filteredPages: { [categoryAndPage: string]: Deal[] } = {};

      var selectedList =  listType === "My Deals" ? state.cachedCurrentUserDeals : state.cachedAvailableDeals
      for (const key in selectedList) {
        if (key.endsWith(`-${category}`)) {
          filteredPages[key] = selectedList[key];
        }
      }
      return filteredPages;
    }
  );
  

  