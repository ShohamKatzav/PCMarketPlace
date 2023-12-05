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
import { TransactionComponent } from '../transaction/transaction.component';
import { FiltersComponent } from '../filters/filters.component';
import { PreventUnsavedChangesGuard } from '../guards/prevent-unsaved-changes.guard';
import { DealsListType } from '../models/dealsListType';


const routes: Routes = [
  {path:'my-deals', component: DealListComponent, data : { listType: DealsListType.CurrentUserDeals}, pathMatch: 'full',},
  {path:'', component: DealListComponent, data :{ listType: DealsListType.AvailableDeals}, pathMatch: 'full'},
  {path:'transaction', component: TransactionComponent, pathMatch: 'full'},
  {path:'view-deal', component: DealDetailsComponent},
  {path:'new-deal', component: CreateDealComponent, canDeactivate: [PreventUnsavedChangesGuard]},
  {path:'edit', component: EditDealComponent, canDeactivate: [PreventUnsavedChangesGuard]},
]

@NgModule({
  declarations: [
    DealListComponent,
    DealDetailsComponent,
    CreateDealComponent,
    EditDealComponent,
    ProductListComponent,
    ProductCardComponent,
    PhotoChangeComponent,
    FiltersComponent

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
