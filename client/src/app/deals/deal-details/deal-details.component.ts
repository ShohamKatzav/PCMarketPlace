import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Deal } from 'src/app/models/deal';
import { Product } from 'src/app/models/product';
import { DealService } from 'src/app/services/deal.service';

@Component({
  selector: 'app-deal-details',
  templateUrl: './deal-details.component.html',
  styleUrls: ['./deal-details.component.css']
})
export class DealDetailsComponent implements OnInit {

  deal: Deal;
  products: Product[];
  constructor(private route: ActivatedRoute, private dealService: DealService) { }


  ngOnInit(): void {
    this.loadDeal();
  }

  loadDeal() {
    const dealid = this.route.snapshot.paramMap.get('dealid') as unknown;
    this.dealService.getDeal(dealid as number).subscribe( deal =>{
      this.deal = deal;
      this.products = this.deal.products;
    });

    
  }
}
