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
  constructor(private dealService: DealService) { }


  ngOnInit(): void {
    this.deal = this.dealService.getSavedDeal();
  }
}
