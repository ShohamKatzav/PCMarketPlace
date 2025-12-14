import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [
    CommonModule,
    ProductCardComponent
  ]
})
export class ProductListComponent implements OnInit {

  @Input() products!: Product[];
  constructor() { }

  ngOnInit(): void {
  }

}
