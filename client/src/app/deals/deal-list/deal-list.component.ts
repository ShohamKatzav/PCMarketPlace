import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { DealService } from 'src/app/services/deal.service';
import { MemberService } from 'src/app/services/member.service';
import { Router } from '@angular/router';
import { pluck, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css']
})
export class DealListComponent implements OnInit {
  deals$: Observable<Deal[]>;
  deleteDealSubscription: Subscription;
  member$: Observable<Member> = this.memberService.currentMember$;
  listType: string;
  currentPage: number = 1;
  tableSize: number = 6;
  totalItemsCount: number = 0;

  filterByCaregory: string;


  constructor(private memberService: MemberService, private dealService: DealService,
    private route: ActivatedRoute, private router: Router) {
    this.member$ = this.memberService.currentMember$;
  }

  ngOnInit() {
    this.filterByCaregory = "Any";
    this.route.data.subscribe(data => {
      this.listType = data.listType;
      this.dealService.setSavedListType(data.listType);
    })
    this.deals$ = this.loadDeals();
  }


  loadDeals() {
    return this.member$.pipe(
      // complete previous inner observable, emit values
      switchMap(member => {
        if (!member) return of([]);
        const dealsListObservable = this.dealService.getDealsPage(member.id, this.currentPage, this.tableSize, this.filterByCaregory);
        return dealsListObservable.pipe(
          tap(res => {
            this.totalItemsCount = res.totalCount;
          }),
          pluck('deals')
        );
      })
    );
  }

  deleteDeal(dealId: number, pageCategory: string) {
    this.deleteDealSubscription = this.dealService.deleteDeal(dealId).subscribe(() => {

      this.dealService.getTotalCountForCategory(this.filterByCaregory).subscribe(count => this.totalItemsCount = count);
      const totalPages = Math.ceil(this.totalItemsCount / this.tableSize);
      
      if (this.currentPage > totalPages && totalPages > 0) {
        this.currentPage = totalPages;
      }
      this.deals$ = this.loadDeals();

      if (totalPages > this.currentPage) {
        this.dealService.updateCacheAfterRemoving(pageCategory, totalPages);
      }
    });
  };


  onTableDataChange(event: any) {
    this.currentPage = event;
    this.deals$ = this.loadDeals();
  }

  viewDeal(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/view-deal']);
  }
  editDeal(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.dealService.setSavedPageCategory(`${this.currentPage}-${this.filterByCaregory}`);
    this.router.navigate(['deals/edit']);
  }
  buyNow(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.dealService.setSavedPageCategory(`${this.currentPage}-${this.filterByCaregory}`);
    this.router.navigate(['deals/transaction']);
  }

  categotyChange(category) {
    this.currentPage = 1;
    this.filterByCaregory = category
    this.deals$ = this.loadDeals();
  }

  ngOnDestroy() {
    if (this.deleteDealSubscription) {
      this.deleteDealSubscription.unsubscribe();
    }
  }

}
