import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../product/product-list/product-list.component';
import { ProductCardComponent } from '../product/product-card/product-card.component';

const routes: Routes = [
  {path:'',component: ProductListComponent, pathMatch: 'full'},
  {path:':id',component: ProductCardComponent}
]

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsModule { }
