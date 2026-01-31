import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { combineLatest, of, Observable } from 'rxjs'; // Added Observable import
import { switchMap, tap, map, take } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { DealService } from 'src/app/services/deal.service';
import { MemberService } from 'src/app/services/member.service';
import { FiltersComponent } from 'src/app/filters/filters.component';
import { DealsListType } from 'src/app/models/dealsListType';
import { Price } from 'src/app/models/price';
import { Deal } from 'src/app/models/deal';

@Component({
  standalone: true,
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css'],
  imports: [CommonModule, RouterModule, NgxPaginationModule, FiltersComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DealListComponent implements OnInit {
  private memberService = inject(MemberService);
  private dealService = inject(DealService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // State Signals
  page = signal<number>(1);
  tableSize = 6;
  category = signal<string>('Any');
  price = signal<Price>({ min: null, max: null });
  refresh = signal<number>(0);
  totalItemsCount = signal<number>(0);
  member = toSignal(this.memberService.currentMember$);

  private combined$: Observable<Deal[]> = combineLatest([
    this.memberService.currentMember$,
    toObservable(this.page),
    toObservable(this.category),
    toObservable(this.price),
    toObservable(this.refresh)
  ]).pipe(
    switchMap(([member, page, category, price]) => {
      if (!member) return of({ deals: [] as Deal[], totalCount: 0 });

      return (price.min == null && price.max == null)
        ? this.dealService.getDealsPage(member.id, page, 6, category)
        : this.dealService.fetchDealsPageFromServer(member.id, page, 6, category, null, price);
    }),
    tap(res => this.totalItemsCount.set(res.totalCount)),
    map(res => res.deals)
  );

  deals = toSignal(this.combined$, { initialValue: [] as Deal[] });

  listType!: DealsListType;
  AvailableDeals = DealsListType.AvailableDeals;
  CurrentUserDeals = DealsListType.CurrentUserDeals;

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe(data => {
      this.listType = data.listType;
      this.dealService.setSavedListType(data.listType);
    });
  }

  onTableDataChange(event: number) {
    this.page.set(event);
  }

  categotyChange(category: string) {
    this.page.set(1);
    this.category.set(category);
  }

  priceChange(price: Price) {
    this.page.set(1);
    this.price.set(price);
  }

  deleteDeal(dealId: number) {
    this.dealService.deleteDeal(dealId).pipe(take(1)).subscribe(() => {
      this.refresh.update(n => n + 1);
    });
  }

  viewDeal(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/view-deal']);
  }

  buyNow(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/transaction']);
  }

  editDeal(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/edit'], { state: { deal } });
  }
}