import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  categories$ : Observable<Category[]>;
  @Output() categoryChange = new EventEmitter<Category>();

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  onSelectCategory(event)
  {
    this.categoryChange.emit(event.target.value);
  }

}
