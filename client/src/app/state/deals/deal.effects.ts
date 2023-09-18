import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as DealActions from './deal.actions';
import { DealService } from 'src/app/services/deal.service';

@Injectable()
export class DealEffects {
  constructor(
    private actions$: Actions,
    private dealService: DealService,
  ) { }

  loadDeals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealActions.loadPageAvailableDeals, DealActions.loadPageCurrentUserDeals),
      switchMap((action) => {
        const { userId, pageNumber, category, tableSize } = action;

        const loadDealsMethod = this.dealService.getDealsPage(userId, pageNumber, tableSize, category);

        return loadDealsMethod.pipe(
          map((dealsResponse) => {
            const { deals, totalCount } = dealsResponse;

            const successAction = action.type === DealActions.loadPageAvailableDeals.type
              ? DealActions.loadAvailableDealsSuccessfully({ deals, pageNumber, category, totalCount })
              : DealActions.loadCurrentUserDealsSuccessfully({ deals, pageNumber, category, totalCount });

            return successAction;
          }),
          catchError((error) =>
            of(DealActions.loadDealsFailure({ error: error.message }))
          )
        );
      })
    )
  );

}