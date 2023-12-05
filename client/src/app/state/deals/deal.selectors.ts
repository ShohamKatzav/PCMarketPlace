import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { DealState } from './deal.reducer';
import { Deal } from 'src/app/models/deal';
import { DealsListType } from 'src/app/models/dealsListType';

export const selectDealState = (state: AppState) => state.deals;

export const selectTotalAvailableDealsCount = (category: string) => createSelector(
  selectDealState,
  (state: DealState) => (
    state.availableDealsTotalCountPerPage[category]
  )
);

  export const selectCachedForPage = (pageNumber: string, listType: DealsListType = DealsListType.CurrentUserDeals) =>
  createSelector(
    selectDealState,
    (state: DealState) => (
      listType == DealsListType.CurrentUserDeals ? 
      state.cachedCurrentUserDeals[pageNumber] || [] :
      state.cachedAvailableDeals[pageNumber] || []
    )
  );

export const selectTotalDealsCount = (category: string, listType: DealsListType = DealsListType.CurrentUserDeals) => createSelector(
  selectDealState,
  (state: DealState) => (
    listType == DealsListType.CurrentUserDeals ? 
    state.currentUserDealsTotalCountPerPage[category] :
    state.availableDealsTotalCountPerPage[category]
  )
);
  
  export const selectCachedDeals = (listType: DealsListType = DealsListType.CurrentUserDeals) =>
  createSelector(
    selectDealState,
    (state: DealState) => (
      listType === DealsListType.CurrentUserDeals ? state.cachedCurrentUserDeals || []
       : state.cachedAvailableDeals || []
    )
  );

  export const getAllPagesWithCategory = (category: string, listType: DealsListType = DealsListType.CurrentUserDeals) =>
  createSelector(
    selectDealState,
    (state: DealState) => {
      const filteredPages: { [categoryAndPage: string]: Deal[] } = {};

      var selectedList =  listType === DealsListType.CurrentUserDeals ? state.cachedCurrentUserDeals : state.cachedAvailableDeals
      for (const key in selectedList) {
        if (key.endsWith(`-${category}`)) {
          filteredPages[key] = selectedList[key];
        }
      }
      return filteredPages;
    }
  );
  

  