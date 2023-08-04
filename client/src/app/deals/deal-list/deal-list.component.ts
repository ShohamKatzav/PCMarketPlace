import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
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
  member$: Observable<Member> = this.memberService.currentMember$;
  listType: string;
  currentPage: number = 1;
  tableSize: number = 6;
  totalItemsCount: number = 0;

  constructor(private memberService: MemberService, private dealService: DealService,
    private route: ActivatedRoute, private router: Router) {
  }

  async ngOnInit() {
    this.member$ = this.memberService.currentMember$;
    this.route.data.subscribe(data => {
      this.listType = data.listType;
    })
    this.deals$ = await this.loadDeals();
  }


  async loadDeals() {
    return this.member$.pipe(
      // complete previous inner observable, emit values
      switchMap(member => {
        if (!member) return of([]);
        const dealsListObservable = this.listType === "My Deals" ?
          this.dealService.getDealsForUser(member.id, this.currentPage, this.tableSize) :
          this.dealService.getDeals(member.id, this.currentPage, this.tableSize);

        return dealsListObservable.pipe(
          tap(res => {
            this.totalItemsCount = res.totalCount;
          }),
          pluck('deals')
        );
      })
    );
  }

  async deleteDeal(dealId: number) {
    await this.dealService.deleteDeal(dealId).toPromise();
    const totalPages = Math.ceil(--this.totalItemsCount / this.tableSize);
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
    this.deals$ = await this.loadDeals();
  }

  async onTableDataChange(event: any) {
    this.currentPage = event;
    this.deals$ = await this.loadDeals();
  }


  buyNow(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/transaction']);
  }

}
