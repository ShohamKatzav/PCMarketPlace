import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of, pipe } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Deal } from '../models/deal';
import { Product } from '../models/product';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import * as DealActions from '../state/deals/deal.actions';
import {
  getAllPagesWithCategory,
  selectCachedDeals,
  selectCachedForPage,
  selectTotalDealsCount
} from '../state/deals/deal.selectors';
import { MemberService } from './member.service';

@Injectable({
  providedIn: 'root'
})
export class DealService {


  private readonly dealKey = 'deal_data';
  private readonly pageCategoryKey = 'pageCategory_data';
  private readonly listTypeKey = 'listType_data';

  baseUrl = environment.apiUrl;
  pageSize: number = 6;
  noSpinnerHeader = new HttpHeaders().set('Skip-Spinner', 'true');

  constructor(private http: HttpClient, private store: Store<AppState>, private memberService: MemberService) {
  }


  setSavedDeal(deal: Deal) {
    sessionStorage.setItem(this.dealKey, JSON.stringify(deal));
  }

  getSavedDeal(): Deal | null {
    const dealData = sessionStorage.getItem(this.dealKey);
    return dealData ? JSON.parse(dealData) : null;
  }
  setSavedPageCategory(pageCategory: string) {
    sessionStorage.setItem(this.pageCategoryKey, JSON.stringify(pageCategory));
  }

  getSavedPageCategory(): string | null {
    const pageCategoryData = sessionStorage.getItem(this.pageCategoryKey);
    return pageCategoryData ? JSON.parse(pageCategoryData) : null;
  }


  setSavedListType(listType: string) {
    sessionStorage.setItem(this.listTypeKey, JSON.stringify(listType));
  }

  getSavedListType(): string | null {
    const listTypeData = sessionStorage.getItem(this.listTypeKey);
    return listTypeData ? JSON.parse(listTypeData) : null;
  }


  getCachedDeals(): Observable<any> {
    return this.store.select(selectCachedDeals(this.getSavedListType())).pipe(take(1));
  }

  getCachedDealsForPageCategory(pageCategory: string): Observable<any> {
    return this.store.select(selectCachedForPage(pageCategory, this.getSavedListType())).pipe(take(1));
  }

  getTotalCountForCategory(category: string): Observable<any> {
    return this.store.select(selectTotalDealsCount(category, this.getSavedListType())).pipe(take(1));
  }

  getAllPagesWithCategory(category: string): Observable<any> {
    return this.store.select(getAllPagesWithCategory(category, this.getSavedListType())).pipe(take(1));
  }

  getDeal(dealId: number): Observable<Deal> {
    return this.http.get<Deal>(`${this.baseUrl}deals/GetDeal/${dealId}`);
  }

  getDealsPage(userId: number, currentPage: number, tableSize: number, category: string):
    Observable<{ deals: Deal[], totalCount: number }> {
    return this.fetchDealsPageFromServerOrState(userId, currentPage, tableSize, category, this.getSavedListType()).pipe(
      switchMap(result => {
        const totalPages = Math.ceil(result.totalCount / this.pageSize);
        // Fetch and save the next page only if there's more data
        const nextPage = currentPage + 1;

        if (nextPage <= totalPages) {
          // Trigger the API call for the next page
          this.fetchDealsPageFromServer(userId, nextPage, tableSize, category, this.noSpinnerHeader).subscribe();
        }
        return of(result);
      })
    );
  }

  fetchDealsPageFromServerOrState(userId: number, currentPage: number, tableSize: number, category: string, currentUserOrAvailable: string, headers: any = null):
    Observable<{ deals: Deal[], totalCount: number }> {
    const cacheKey = `${currentPage}-${category}`; // Include category in the cache key

    const selectDeals = selectCachedForPage(cacheKey, currentUserOrAvailable);
    const selectTotalDealsCountForList = selectTotalDealsCount(category, currentUserOrAvailable);

    return combineLatest([
      this.store.select(selectDeals),
      this.store.select(selectTotalDealsCountForList),
    ]).pipe(
      switchMap(([deals, totalCount]) => {
        // deals with length means we already did 1 api call and received/saved answer in state
        if (deals.length || totalCount === 0)
          return of({ deals, totalCount }); // Emit the object directly

        // If deals.length is falsy, make the HTTP request and return the observable
        return this.fetchDealsPageFromServer(userId, currentPage, tableSize, category, headers);
      })
    );
  }

  fetchDealsPageFromServer(userId: number, currentPage: number, tableSize: number, category: string, headers: any = null):
    Observable<{ deals: Deal[], totalCount: number }> {
    const queryParams = { "userId": userId.toString(), "currentPage": currentPage.toString(), "tableSize": tableSize.toString(), "category": category };

    const loadDealsSuccessAction = this.getSavedListType() === "My Deals" ?
      DealActions.loadCurrentUserDealsSuccessfully : DealActions.loadAvailableDealsSuccessfully;

    // Determine the API endpoint based on currentUserOrAvailable
    const apiEndpoint = this.getSavedListType() === "My Deals" ? `${this.baseUrl}deals/GetDealsForUser` : `${this.baseUrl}deals`;

    return this.http.get<{ deals: Deal[], totalCount: number }>(apiEndpoint, { params: queryParams, headers: headers }).pipe(
      tap(response => {
        const result = { deals: response.deals, pageNumber: currentPage, category: category, totalCount: response.totalCount };
        this.store.dispatch(loadDealsSuccessAction(result));
        return { deals: response.deals, totalCount: response.totalCount };
      })
    );
  }

  getProductsForDeal(dealId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}deals/GetProductsForDeal/${dealId}`);
  }

  create(model: any): Observable<any> {
    const modelWithImage = this.dealWithUpdatedImage(model);
    return this.http.post<Deal>(this.baseUrl + 'deals/create', model, { headers: this.noSpinnerHeader }).pipe(
      map((deal: Deal) => {
        const categories = Array.from(new Set(["Any", model.products.map(p => p.category)])).flat();
        for (var category of categories) {
          this.getTotalCountForCategory(category).subscribe(count => {
            if (count != undefined) {
              this.getCachedDealsForPageCategory(`${Math.ceil((count + 1) / this.pageSize)}-${category}`).subscribe(deals => {
                if (!!deals) {
                  const DealWithId = { id: deal.id, ...modelWithImage };
                  this.store.dispatch(DealActions.addDeal({ deal: DealWithId, category }));
                }
                else
                  if (!!count)
                    this.store.dispatch(DealActions.setCountForCategoryInCurrentUser({ category, count: count + 1 }));
              });
            }
          })
        }
      })
    );
  }

  // The user might add and delete products from the deal.
  // And so deals which were belong in some categories won't be there after the changes.
  // First of all, I add/delete the deal from the intended categories.
  // For the other (unchanged) categories I call the edit state method.
  edit(model: any): Observable<any> {

    const addDealAction = this.getSavedListType() === "My Deals" ?
      DealActions.addDeal : DealActions.addDealFromAvailableDeals;
    const removeDealAction = this.getSavedListType() === "My Deals" ?
      DealActions.removeDeal : DealActions.removeDealFromAvailableDeals;
    const editDealAction = this.getSavedListType() === "My Deals" ?
      DealActions.editDeal : DealActions.editDealFromAvailableDeals;
    const setCountAction = this.getSavedListType() === "My Deals" ?
      DealActions.setCountForCategoryInCurrentUser : DealActions.setCountForCategoryInAvailable;

    return this.getDeal(model.id).pipe(
      switchMap(oldDeal => {
        const modelWithImage = this.dealWithUpdatedImage(model);

        return this.http.put<Deal>(this.baseUrl + 'deals', modelWithImage, { headers: this.noSpinnerHeader }).pipe(
          map(() => {

            const oldCategories = new Set([...oldDeal.products.map(p => p.category)]);
            const newCategories = new Set([...model.products.map(p => p.category)]);

            // Convert Sets back to Arrays and check for updates in each array
            const categoriesToRemove = [...oldCategories].filter(category => !newCategories.has(category));
            const categoriesToAdd = [...newCategories].filter(category => !oldCategories.has(category));

            for (const category of categoriesToRemove) {
              this.getTotalCountForCategory(category).subscribe(totalCountForCategory => {
                this.getAllPagesWithCategory(category.toString()).subscribe(pages => {
                  for (const key in pages) {
                    if (pages[key].some(deal => deal.id === model.id)) {
                      this.store.dispatch(removeDealAction({ dealId: model.id, pageCategory: key }));
                      this.updateCacheAfterRemoving(key, totalCountForCategory);
                    }
                  }
                });
              })
            }
            for (const category of categoriesToAdd) {
              this.getAllPagesWithCategory(category.toString()).subscribe(pages => {
                this.getTotalCountForCategory(category).subscribe(totalCountForCategory => {
                  // If last page in the caregory cached dispatch add to save the changes
                  if (!!pages[`${Math.ceil((totalCountForCategory + 1) / this.pageSize)}-${category}`])
                    this.store.dispatch(addDealAction({ deal: modelWithImage, category }));
                  // Else just increase the total count to save the right amount for pagination purposes
                  else
                    this.getTotalCountForCategory(category).subscribe(oldCount => {
                      if (!!oldCount)
                        this.store.dispatch(setCountAction({ category, count: oldCount + 1 }));
                    });
                });
              });
            }

            this.getCachedDeals().subscribe(deals => {
              const keys = Object.keys(deals);

              if (keys.length > 0) {
                for (var key of keys) {
                  const values = deals[key];
                  for (var value of values) {
                    if (value.id === model.id) {
                      this.store.dispatch(editDealAction({ deal: modelWithImage, pageCategory: key.toString() }));
                    }
                  }
                }
              }
            });
          })
        );
      })
    );
  }

  deleteDeal(dealId: number) {
    const removeDealAction = this.getSavedListType() === "My Deals" ?
      DealActions.removeDeal : DealActions.removeDealFromAvailableDeals;

    return this.http.delete(`${this.baseUrl}deals/delete-deal/${dealId}`, { headers: this.noSpinnerHeader }).pipe(
      map(() => {
        // From now on I'll check if I already cached page with the deleted deal
        // If so, then edit the page accordingly
        this.getCachedDeals().subscribe(deals => {
          const keys = Object.keys(deals);
          if (keys.length > 0) {
            for (var key of keys) {
              const values = deals[key];
              for (var value of values) {
                if (value.id === dealId) {
                  this.store.dispatch(removeDealAction({ dealId, pageCategory: key }));
                }
              }
            }
          }
        })
      })
    );
  }

  deletePhoto(productId: number) {
    return this.http.delete(`${this.baseUrl}deals/delete-photo/${productId}`);
  }

  checkoutDeal(dealId: number, paymentIntentId: string, paymentMethodId: string): Observable<any> {
    const body = { dealId, paymentIntentId, paymentMethodId };
    return this.http.put(`${this.baseUrl}deals/checkout`, body).pipe(
      map(() => {
        this.getDeal(dealId).subscribe( deal => {
          const categories = Array.from(new Set(["Any", deal.products.map(p => p.category)])).flat();

          for (const category of categories) {
            this.getTotalCountForCategory(category).subscribe(totalCountForCategory => {
              this.getAllPagesWithCategory(category.toString()).subscribe(pages => {
                for (const key in pages) {
                  if (pages[key].some(deal => deal.id === dealId)) {
                    this.store.dispatch(DealActions.removeDealFromAvailableDeals({ dealId, pageCategory: key }));
                    this.updateCacheAfterRemoving(key, totalCountForCategory);
                  }
                }
              });
            })
          }
        }
        );
      }));
  }

  getPublisableKey(): Observable<any> {
    return this.http.get(`${this.baseUrl}deals/publishable-key`);
  }

  getSecretKey(dealId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}deals/secret-key`, dealId);
  }

  dealWithUpdatedImage(model: any) {
    const modelToReturn = { ...model }
    for (const product of modelToReturn.products) {
      if (product.productPhoto?.url && product.productPhoto.url !== './assets/no-image.jpeg') {
        modelToReturn.dealPhoto = { url: product.productPhoto.url };
        return modelToReturn;
      }
    }
    modelToReturn.dealPhoto = {
      url: "https://www.creativefabrica.com/wp-content/uploads/2018/12/Deal-icon-by-back1design1.jpg"
    };
    return modelToReturn;
  }

  updateCacheAfterRemoving(pageCategory: string, totalPages: number) {
    const currentPage = parseInt(pageCategory.split('-')[0]);
    const category = pageCategory.split('-')[1];
    for (let i = currentPage + 1; i <= totalPages; i++) {
      const nextPage = i + "-" + category;
      this.getCachedDealsForPageCategory(nextPage).subscribe(deals => {
        if (!!deals) {
          this.memberService.currentMember$.subscribe((member) => {
            this.fetchDealsPageFromServer(member.id, i, this.pageSize, category, this.noSpinnerHeader);
          });
        }
      });
    }
  }
}
