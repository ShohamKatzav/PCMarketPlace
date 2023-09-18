import { createReducer, on } from '@ngrx/store';
import {
  addDeal,
  removeDeal,
  editDeal,
  loadPageAvailableDeals,
  loadAvailableDealsSuccessfully,
  loadDealsFailure,
  loadPageCurrentUserDeals,
  loadCurrentUserDealsSuccessfully,
  removeDealFromAvailableDeals,
  editDealFromAvailableDeals,
  addDealFromAvailableDeals,
  setCountForCategoryInCurrentUser,
  setCountForCategoryInAvailable
} from './deal.actions';
import { Deal } from 'src/app/models/deal';

export interface DealState {
  cachedAvailableDeals: { [categoryAndPage: string]: Deal[] };
  availableDealsTotalCountPerPage: { [categoryName: string]: number };
  cachedCurrentUserDeals: { [categoryAndPage: string]: Deal[] };
  currentUserDealsTotalCountPerPage: { [categoryName: string]: number };
  error: string;
  status: "pending" | "loading" | "error" | "success";
}

export const initialState: DealState = {
  cachedAvailableDeals: {},
  availableDealsTotalCountPerPage: {},
  cachedCurrentUserDeals: {},
  currentUserDealsTotalCountPerPage: {},
  error: null,
  status: "pending",
};

export const dealReducer = createReducer(
  // Supply the initial state
  initialState,
  on(addDeal, (state, { deal, category }) => {
    return {
      ...state,
      currentUserDealsTotalCountPerPage: {
        ...state.currentUserDealsTotalCountPerPage,
        [category]: state.currentUserDealsTotalCountPerPage[category] + 1
      },
      cachedCurrentUserDeals: {
        ...state.cachedCurrentUserDeals,
        [`${Math.floor(state.currentUserDealsTotalCountPerPage[category] / 6) + 1}-${category}`]:
          [...(state.cachedCurrentUserDeals[`${Math.floor(state.currentUserDealsTotalCountPerPage[category] / 6) + 1}-${category}`] || []), deal],
      },
    }
  }),

  on(removeDeal, (state, { dealId, pageCategory }) => {
    const nextPageParts = pageCategory.split('-');
    const incrementedPageNumber = parseInt(nextPageParts[0]) + 1;
    const category = nextPageParts[1];
    const nextPage = `${incrementedPageNumber}-${category}`;

    const currentPageDeals = state.cachedCurrentUserDeals[pageCategory];
    const nextPageDeals = state.cachedCurrentUserDeals[nextPage];

    const updatedCurrentPageDeals = currentPageDeals.filter(deal => deal.id !== dealId);

    // Move the first deal from the next page to the end of the current page
    if (nextPageDeals) {
      const [firstDealFromNextPage, ...remainingNextPageDeals] = nextPageDeals;
      if (firstDealFromNextPage) {
        updatedCurrentPageDeals.push(firstDealFromNextPage);
      }
    }
    return {
      ...state,
      currentUserDealsTotalCountPerPage: {
        ...state.currentUserDealsTotalCountPerPage,
        [category]: state.currentUserDealsTotalCountPerPage[category] - 1
      },
      cachedCurrentUserDeals: {
        ...state.cachedCurrentUserDeals,
        [pageCategory]: updatedCurrentPageDeals,
      },
    };
  }),

  on(editDeal, (state, { deal, pageCategory }) => {
    const dealIndex = state.cachedCurrentUserDeals[pageCategory].findIndex(oldDeal => oldDeal.id === deal.id);
    const sumOfPrices = deal.products.reduce((total, product) => total + product.price, 0);
    const updatedDeal = {
      ...state.cachedCurrentUserDeals[pageCategory][dealIndex],
      dealPhoto: deal.dealPhoto,
      description: deal.description, products: deal.products, totalPrice: sumOfPrices, lastModified: new Date()
    };

    const updatedPage = [...state.cachedCurrentUserDeals[pageCategory]];
    updatedPage[dealIndex] = updatedDeal;

    return {
      ...state,
      cachedCurrentUserDeals: {
        ...state.cachedCurrentUserDeals,
        [pageCategory]: updatedPage,
      },
    };
  }),

  on(addDealFromAvailableDeals, (state, { deal, category }) => {
    return {
      ...state,
      availableDealsTotalCountPerPage: {
        ...state.availableDealsTotalCountPerPage,
        [category]: state.availableDealsTotalCountPerPage[category] + 1
      },
      cachedAvailableDeals: {
        ...state.cachedAvailableDeals,
        [`${Math.floor(state.availableDealsTotalCountPerPage[category] / 6) + 1}-${category}`]:
          [...(state.cachedAvailableDeals[`${Math.floor(state.availableDealsTotalCountPerPage[category] / 6) + 1}-${category}`] || []), deal],
      },
    }
  }),

  on(removeDealFromAvailableDeals, (state, { dealId, pageCategory }) => {
    const nextPageParts = pageCategory.split('-');
    const incrementedPageNumber = parseInt(nextPageParts[0]) + 1;
    const category = nextPageParts[1];
    const nextPage = `${incrementedPageNumber}-${category}`;

    const currentPageDeals = state.cachedAvailableDeals[pageCategory];
    const nextPageDeals = state.cachedAvailableDeals[nextPage];

    const updatedCurrentPageDeals = currentPageDeals.filter(deal => deal.id !== dealId);

    // Move the first deal from the next page to the end of the current page
    if (nextPageDeals) {
      const [firstDealFromNextPage, ...remainingNextPageDeals] = nextPageDeals;
      if (firstDealFromNextPage) {
        updatedCurrentPageDeals.push(firstDealFromNextPage);
      }
    }
    return {
      ...state,
      availableDealsTotalCountPerPage: {
        ...state.availableDealsTotalCountPerPage,
        [category]: state.availableDealsTotalCountPerPage[category] - 1
      },
      cachedAvailableDeals: {
        ...state.cachedAvailableDeals,
        [pageCategory]: updatedCurrentPageDeals,
      },
    };
  }),

  on(editDealFromAvailableDeals, (state, { deal, pageCategory }) => {
    const dealIndex = state.cachedAvailableDeals[pageCategory].findIndex(oldDeal => oldDeal.id === deal.id);
    const sumOfPrices = deal.products.reduce((total, product) => total + product.price, 0);
    const updatedDeal = {
      ...state.cachedAvailableDeals[pageCategory][dealIndex],
      dealPhoto: deal.dealPhoto,
      description: deal.description, products: deal.products, totalPrice: sumOfPrices, lastModified: new Date()
    };

    const updatedPage = [...state.cachedAvailableDeals[pageCategory]];
    updatedPage[dealIndex] = updatedDeal;

    return {
      ...state,
      cachedAvailableDeals: {
        ...state.cachedAvailableDeals,
        [pageCategory]: updatedPage,
      },
    };
  }),

  on(loadPageAvailableDeals, (state) => ({ ...state, status: "loading" as const })),
  on(loadAvailableDealsSuccessfully, (state, { deals, pageNumber, category, totalCount }) => ({
    ...state,
    cachedAvailableDeals: {
      ...state.cachedAvailableDeals,
      [`${pageNumber}-${category}`]: deals,
    },
    availableDealsTotalCountPerPage: {
      ...state.availableDealsTotalCountPerPage,
      [category]: totalCount,
    },
    error: null,
    status: "success" as const,
  })),

  on(loadPageCurrentUserDeals, (state) => ({ ...state, status: "loading" as const })),
  on(loadCurrentUserDealsSuccessfully, (state, { deals, pageNumber, category, totalCount }) => ({
    ...state,
    cachedCurrentUserDeals: {
      ...state.cachedCurrentUserDeals,
      [`${pageNumber}-${category}`]: deals,
    },
    currentUserDealsTotalCountPerPage: {
      ...state.currentUserDealsTotalCountPerPage,
      [category]: totalCount,
    },
    error: null,
    status: "success" as const,

  })),
  on(loadDealsFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: "error" as const,
  })),

  on(setCountForCategoryInCurrentUser , (state, { category, count }) => ({
    ...state,
    currentUserDealsTotalCountPerPage: {
      ...state.currentUserDealsTotalCountPerPage,
      [category]: count,
    },
  })),
  on(setCountForCategoryInAvailable , (state, { category, count }) => ({
    ...state,
    availableDealsTotalCountPerPage: {
      ...state.availableDealsTotalCountPerPage,
      [category]: count,
    },
  })),
);