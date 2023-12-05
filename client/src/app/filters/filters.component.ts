import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { Price } from '../models/price';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  categories$: Observable<Category[]>;
  price: Price = { min: null, max: null };
  @Output() categoryChange = new EventEmitter<Category>();
  @Output() priceChange = new EventEmitter<Price>();
  @ViewChild('minPriceInput') minPriceInput!: ElementRef;
  @ViewChild('maxPriceInput') maxPriceInput!: ElementRef;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  changePrice(type: string, e) {
    type == 'min' ? this.price.min = e.target.value : this.price.max = e.target.value
  }
  onSelectCategory(event) {
    this.categoryChange.emit(event.target.value);
  }
  onPriceFilter() {
    this.priceChange.emit(this.price);
  }
  onInitPriceFilter() {
    this.minPriceInput.nativeElement.value = '';
    this.maxPriceInput.nativeElement.value = '';
    this.price = { min: null, max: null };
    this.priceChange.emit(this.price);
  }

}
