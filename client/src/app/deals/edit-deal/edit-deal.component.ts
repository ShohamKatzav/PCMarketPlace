import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

import { Deal } from 'src/app/models/deal';
import { CategoryService } from 'src/app/services/category.service';
import { DealService } from 'src/app/services/deal.service';
import { PhotoChangeComponent } from '../photo-change/photo-change.component';

@Component({
  standalone: true,
  selector: 'app-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
    PhotoChangeComponent
  ]
})
export class EditDealComponent implements OnInit {
  private dealService = inject(DealService);
  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  // Categories as a Signal for clean template access
  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] });

  deal: Deal;
  dealForm: FormGroup;
  currentPage = 1;
  totalItemsCount = 0;

  ngOnInit() {
    this.deal = this.dealService.getSavedDeal();

    // Initialize form
    this.dealForm = new FormGroup({
      description: new FormControl(this.deal?.description || '', [Validators.required, Validators.minLength(8)]),
      products: new FormArray([])
    });

    if (this.deal?.products) {
      this.populateProducts();
    }
  }

  get productItems() {
    return this.dealForm.get('products') as FormArray;
  }

  private populateProducts() {
    this.deal.products.forEach(p => {
      this.productItems.push(new FormGroup({
        id: new FormControl(p.id),
        name: new FormControl(p.name, Validators.required),
        category: new FormControl(p.category, Validators.required),
        price: new FormControl(p.price, [Validators.required, Validators.min(0)])
      }));
    });
    this.totalItemsCount = this.productItems.length;
  }

  addNewRow() {
    if (this.productItems.length < 10) {
      const row = new FormGroup({
        id: new FormControl(null),
        name: new FormControl(null, Validators.required),
        category: new FormControl('Others', Validators.required),
        price: new FormControl(null, [Validators.required, Validators.min(0)]),
      });

      this.productItems.push(row);

      this.deal.products.push({
        name: '',
        category: 'Others',
        price: 0,
        productPhoto: { url: './assets/no-image.jpeg', publicId: '' }
      } as any);

      this.totalItemsCount = this.productItems.length;

      // Use timeout to ensure the DOM is ready for the new page
      setTimeout(() => {
        this.currentPage = this.totalItemsCount;
      });
    } else {
      this.toastr.warning("Maximum 10 products per deal.");
    }
  }

  removeItem(index: number) {
    this.productItems.removeAt(index);
    this.deal.products.splice(index, 1);
    this.totalItemsCount--;
    // Ensure currentPage doesn't point to a non-existent page
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalItemsCount));
  }

  edit() {
    if (this.dealForm.invalid) {
      this.toastr.error("Please fill all required fields correctly.");
      return;
    }

    const productsValue = this.productItems.value;
    const totalPrice = productsValue.reduce((acc: number, curr: any) => acc + (curr.price || 0), 0);

    if (totalPrice < 5) {
      this.toastr.warning("Deal total price must be 5 ILS or above.");
      return;
    }

    // Merging form data with existing photo URLs
    const updatedModel = {
      id: this.deal.id,
      description: this.dealForm.value.description,
      products: productsValue.map((p: any, i: number) => ({
        ...p,
        productPhoto: this.deal.products[i]?.productPhoto || { url: './assets/no-image.jpeg' }
      }))
    };

    this.dealService.edit(updatedModel).subscribe({
      next: () => {
        this.toastr.success("Deal updated successfully");
        this.dealService.getDeal(this.deal.id).subscribe(refreshedDeal => {
          this.dealService.setSavedDeal(refreshedDeal);
          this.router.navigate(['deals/view-deal']);
        });
      }
    });
  }

  clear() {
    this.dealForm.get('description')?.reset();
    while (this.productItems.length > 0) {
      this.productItems.removeAt(0);
    }
    this.deal.products = [];
    this.totalItemsCount = 0;
    this.currentPage = 1;
  }
}