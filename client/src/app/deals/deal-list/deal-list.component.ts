import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Deal } from 'src/app/models/deal';
import { DealService } from 'src/app/services/deal.service';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css']
})
export class DealListComponent implements OnInit {

  deals$: Observable<Deal[]>;
  constructor(private dealService: DealService) { }

  ngOnInit(): void {
    this.deals$ = this.dealService.getDeals();
  }

}
