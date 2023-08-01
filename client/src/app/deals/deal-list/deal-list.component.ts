import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { DealService } from 'src/app/services/deal.service';
import { MemberService } from 'src/app/services/member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css']
})
export class DealListComponent implements OnInit {

  deals$: Observable<Deal[]>;
  member: Member;
  listType: string;
  currentPage: number = 1;
  tableSize: number = 6;
  totalItemsCount: number = 0;

  constructor(private memberService: MemberService, private dealService: DealService,
    private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.listType = data.listType;
    })
    this.memberService.currentMember$.subscribe(
      {
        next: response => {
          this.member = response;
          this.loadDeals();
        }
      }
    );
  }

  loadDeals() {
    if (!this.member) return;

    const dealsListObservable = this.listType === "My Deals" ?
      this.dealService.getDealsForUser(this.member.id, this.currentPage, this.tableSize) :
      this.dealService.getDeals(this.member.id, this.currentPage, this.tableSize);

    this.deals$ = dealsListObservable.pipe(
      tap(res => this.totalItemsCount = res.totalCount),
      pluck('deals')
    );
  }

  deleteDeal(dealId: number) {
    this.dealService.deleteDeal(dealId).subscribe(() => {
      this.loadDeals();
    });
  }

  onTableDataChange(event: any) {
    this.currentPage = event;
    this.loadDeals();
  }


  buyNow(deal: Deal) {
    this.dealService.setSavedDeal(deal);
    this.router.navigate(['deals/transaction']);
  }

}
