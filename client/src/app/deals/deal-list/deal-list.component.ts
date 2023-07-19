import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
  listType: string;
  page: number = 1;

  constructor(private memberService: MemberService, private dealService: DealService, private route: ActivatedRoute) {

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
    if (this.member)
    {
      if (this.listType == "My Deals")
        this.deals$ = this.dealService.getDealsForUser(this.member.id);
      else
        if (this.listType == "All Deals")
          this.deals$ = this.dealService.getDeals();
    }
  }

  deleteDeal(dealId: number) {
    this.dealService.deleteDeal(dealId).subscribe(() => {
      this.loadDeals();
    });
  }

}
