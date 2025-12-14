import { Component, OnInit } from '@angular/core';
import { Deal } from 'src/app/models/deal';
import { SharedModule } from 'src/app/modules/shared.module';
import { DealService } from 'src/app/services/deal.service';
import { ProductListComponent } from 'src/app/products/product-list/product-list.component';

@Component({
  standalone: true,
  selector: 'app-deal-details',
  templateUrl: './deal-details.component.html',
  styleUrls: ['./deal-details.component.css'],
  imports: [
    SharedModule,
    ProductListComponent
  ]
})
export class DealDetailsComponent implements OnInit {

  deal: Deal;
  constructor(private dealService: DealService) { }


  ngOnInit(): void {
    this.deal = this.dealService.getSavedDeal();
  }
}
