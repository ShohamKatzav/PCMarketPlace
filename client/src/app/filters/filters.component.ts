import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { Price } from '../models/price';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class FiltersComponent {
  private categoryService = inject(CategoryService);

  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });

  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceChange = new EventEmitter<Price>();

  filterForm = new FormGroup({
    category: new FormControl('Any'),
    min: new FormControl<number | null>(null),
    max: new FormControl<number | null>(null)
  });

  onSelectCategory() {
    const selectedName = this.filterForm.value.category ?? 'Any';
    this.categoryChange.emit(selectedName);
  }

  onPriceFilter() {
    const { min, max } = this.filterForm.value;
    this.priceChange.emit({ min: min ?? null, max: max ?? null });
  }

  onInitFilter() {
    this.filterForm.patchValue({ category: 'Any', min: null, max: null });
    this.priceChange.emit({ min: null, max: null });
    this.categoryChange.emit('Any');
  }
}