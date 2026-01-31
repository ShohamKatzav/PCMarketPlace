import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DealService } from 'src/app/services/deal.service';
import { ProductListComponent } from 'src/app/products/product-list/product-list.component';
import { DealsListType } from 'src/app/models/dealsListType';
import { Deal } from 'src/app/models/deal';
import { take } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-deal-details',
  templateUrl: './deal-details.component.html',
  styleUrls: ['./deal-details.component.css'],
  imports: [DatePipe, ProductListComponent]
})
export class DealDetailsComponent {
  private dealService = inject(DealService);
  private router = inject(Router);

  deal = this.dealService.currentDeal;

  listType = this.dealService.getSavedListType();
  CurrentUserDeals = DealsListType.CurrentUserDeals;
  refresh: any;

  buyNow(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/transaction']);
  }

  editDeal(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/edit'], { state: { deal } });
  }

  deleteDeal(dealId: number) {
    this.dealService.deleteDeal(dealId).pipe(take(1)).subscribe(() => {
      this.router.navigate(['deals/my-deals']);
    });
  }
}