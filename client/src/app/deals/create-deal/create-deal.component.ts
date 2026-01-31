import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { DealService } from 'src/app/services/deal.service';
import { PhotoChangeComponent } from '../photo-change/photo-change.component';

@Component({
  standalone: true,
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PhotoChangeComponent
  ]
})
export class CreateDealComponent {
  private dealService = inject(DealService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] });

  products: Product[] = [];
  currentPage = 1;
  totalItemsCount = 0;

  dealForm = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(8)]),
    products: new FormArray([], Validators.required)
  });

  get productItems() {
    return this.dealForm.get('products') as FormArray;
  }

  addNewRow() {
    if (this.productItems.length < 10) {
      const row = new FormGroup({
        name: new FormControl(''), // Start empty
        category: new FormControl('Others'),
        price: new FormControl(null),
      });
      this.productItems.push(row);
      this.products.push({} as Product);
      this.totalItemsCount = this.productItems.length;
      this.currentPage = this.totalItemsCount;
    }
  }

  removeItem(index: number) {
    this.productItems.removeAt(index);
    this.products.splice(index, 1);
    this.totalItemsCount--;
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalItemsCount));
  }

  create() {
    if (this.dealForm.invalid || this.productItems.length === 0) {
      this.toastr.error("Please fill all required fields correctly.");
      return;
    }

    const productsValue = this.productItems.value;
    const totalPrice = productsValue.reduce((acc: number, curr: any) => acc + (curr.price || 0), 0);

    if (totalPrice < 5) {
      this.toastr.warning("Deal total price must be 5 ILS or above.");
      return;
    }

    const finalModel = {
      description: this.dealForm.value.description,
      products: productsValue.map((p: any, i: number) => ({
        ...p,
        productPhoto: this.products[i]?.productPhoto
      }))
    };

    this.dealService.create(finalModel).subscribe({
      next: () => {
        this.toastr.success("Deal created successfully");
        this.router.navigateByUrl("/deals/my-deals");
      }
    });
  }

  clear() {
    this.dealForm.reset();
    while (this.productItems.length !== 0) {
      this.productItems.removeAt(0);
    }
    this.products = [];
    this.currentPage = 1;
    this.totalItemsCount = 0;
  }

  onPageChange(event: number) {
    this.currentPage = event;
  }
}