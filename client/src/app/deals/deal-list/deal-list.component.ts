import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { DealService } from 'src/app/services/deal.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css']
})
export class DealListComponent implements OnInit {

  deals$: Observable<Deal[]>;
  member: Member;
  categories: Category[];
  constructor(private memberService: MemberService, private dealService: DealService) {
    this.memberService.currentMember$.pipe(take(1)).subscribe(
      {
        next: response => {
          this.member = response;
          this.loadDeals();
        }
      }
    );
  }

  ngOnInit(): void {
    this.deals$ = this.dealService.getDeals();
    this.categories = JSON.parse(localStorage.getItem("categories") || '{}')
  }
  loadDeals() {
    if(this.member)
      this.deals$ = this.dealService.getDealsForUser(this.member.id);
  }

  deleteDeal(dealId: number) {
    this.dealService.deleteDeal(dealId).subscribe(() => {
      this.deals$ = this.dealService.getDealsForUser(this.member.id);
    });
  }

}
