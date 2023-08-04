import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Deal } from 'src/app/models/deal';
import { DealService } from 'src/app/services/deal.service';

@Component({
  selector: 'app-deal-details',
  templateUrl: './deal-details.component.html',
  styleUrls: ['./deal-details.component.css']
})
export class DealDetailsComponent implements OnInit {

  deal: Deal;
  constructor(private route: ActivatedRoute, private dealService: DealService) { }


  ngOnInit(): void {
    this.loadDeal();
  }

  async loadDeal() {
    const dealid = this.route.snapshot.paramMap.get('dealid') as unknown;
    const deal$ = await this.dealService.getDeal(dealid as number);
    this.deal = await deal$.toPromise();
  }
}
