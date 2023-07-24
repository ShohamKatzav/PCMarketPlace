import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealListComponent } from '../deals/deal-list/deal-list.component';
import { RouterModule, Routes } from '@angular/router';
import { DealDetailsComponent } from '../deals/deal-details/deal-details.component';
import { SharedModule } from './shared.module';
import { EditDealComponent } from '../deals/edit-deal/edit-deal.component';
import { ProductListComponent } from '../products/product-list/product-list.component';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { PhotoChangeComponent } from '../deals/photo-change/photo-change.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateDealComponent } from '../deals/create-deal/create-deal.component';


const routes: Routes = [
  {path:'my-deals', component: DealListComponent, data :{ listType: "My Deals"}, pathMatch: 'full',},
  {path:'', component: DealListComponent, data :{ listType: "All Deals"}, pathMatch: 'full'},
  {path:':dealid', component: DealDetailsComponent},
  {path:'my-deals/:dealid', component: DealDetailsComponent},
  {path:'new-deal', component: CreateDealComponent},
  {path:'my-deals/edit/:dealid', component: EditDealComponent},

]

@NgModule({
  declarations: [
    DealListComponent,
    DealDetailsComponent,
    CreateDealComponent,
    EditDealComponent,
    ProductListComponent,
    ProductCardComponent,
    PhotoChangeComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxPaginationModule
    
  ],
  exports:[
  ]
})
export class DealsModule { }
