import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealListComponent } from '../deals/deal-list/deal-list.component';
import { RouterModule, Routes } from '@angular/router';
import { DealDetailsComponent } from '../deals/deal-details/deal-details.component';
import { SharedModule } from './shared.module';
import { MyDealsComponent } from '../deals/my-deals/my-deals.component';
import { EditDealComponent } from '../deals/edit-deal/edit-deal.component';
import { ProductListComponent } from '../products/product-list/product-list.component';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { PhotoChangeComponent } from '../deals/photo-change/photo-change.component';


const routes: Routes = [
  {path:'my-deals',component: MyDealsComponent, pathMatch: 'full'},
  {path:'',component: DealListComponent, pathMatch: 'full'},
  {path:':dealid',component: DealDetailsComponent},
  {path:'my-deals/:dealid',component: DealDetailsComponent},
  {path:'my-deals/edit/:dealid',component: EditDealComponent},

]

@NgModule({
  declarations: [
    MyDealsComponent,
    DealListComponent,
    DealDetailsComponent,
    EditDealComponent,
    ProductListComponent,
    ProductCardComponent,
    PhotoChangeComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    
  ],
  exports:[
  ]
})
export class DealsModule { }
