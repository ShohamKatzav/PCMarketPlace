import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { DealService } from 'src/app/services/deal.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-my-deals',
  templateUrl: './my-deals.component.html',
  styleUrls: ['./my-deals.component.css']
})
export class MyDealsComponent implements OnInit {

  deals$: Observable<Deal[]>;
  member: Member;

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
  }

  loadDeals() {
    this.deals$ = this.dealService.getDealsForUser(this.member.id);
  }

  deleteDeal(dealId: number) {
    this.dealService.deleteDeal(dealId).subscribe(() => {
      this.deals$ = this.dealService.getDealsForUser(this.member.id);
    });
  }

}
