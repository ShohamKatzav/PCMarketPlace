import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/services/category.service';
import { DealService } from 'src/app/services/deal.service';

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements OnInit {

  @ViewChild('editForm') EForm: NgForm;
  formSubmitted = false;

  categories$: Observable<Category[]>;
  categories: Category[] = [];
  model: any = {};
  products: Product[] = [];
  items!: FormArray;
  dealForm = new FormGroup({
    description: new FormControl('', Validators.required),
    products: new FormArray([], Validators.required)
  });

  currentPage: number = 1;
  totalItemsCount: number = 0;

  constructor(private dealService: DealService,
    private toastr: ToastrService,
    private router: Router,
    private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
  }

  getProducts() {
    return this.dealForm.get("products") as FormArray;
  }
  getDescription() {
    return this.dealForm.get("description")?.value as string;
  }
  addNewRow() {
    if (this.getProducts().controls.length < 10) {
      this.items = this.getProducts();
      this.items.push(this.genRow());
      this.items.length > 0 ? this.currentPage = ++this.totalItemsCount : this.currentPage = 1;
    }
    else
      this.toastr.warning("Sorry, maximux 10 products per deal.");
  }
  removeItem(index: any) {
    this.items.removeAt(index);

    const updatedProducts = [ ...this.products ];
    updatedProducts.splice(index, 1);
    this.products = updatedProducts;

    this.totalItemsCount -= 1;
    this.items.length > 0 && this.currentPage - 1 > 1 ? this.currentPage -= 1 : this.currentPage = 1;
  }


  genRow(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
    });
  }

  clear() {
    this.dealForm.patchValue({
      description: "",
    });
    if (this.items)
      while (this.items.length > 0)
        this.removeItem(0);
    this.products = [];
  }

  create() {
    const validationResult = this.checkValidation();

    if (validationResult == 1)
      this.toastr.error("Please Enter description (8 characters) and at least 1 product");
    else
    if (validationResult == 2)
      this.toastr.warning("Please do not forget any field");
    else
     if (validationResult == 3)
      this.toastr.warning("Deal price has to be 5 ILS and above");
    else {
      this.model.description = this.dealForm.get("description").value ? this.dealForm.get("description").value : undefined;
      this.model.products = this.items ? Array.from(this.items?.value) : undefined;
      for (let i = 0; i < this.products.length; i++) {
        this.model.products[i].productPhoto = this.products[i]?.productPhoto;
      }
      this.dealService.create(this.model).subscribe(() => {
        this.formSubmitted = true;
        this.router.navigateByUrl("/deals/my-deals");
        this.toastr.success("Deal created");
      });
    }
  }

  checkValidation(): number {
    if (!this.dealForm.get("description")?.value || (!this.items || !Array.from(this.items.value)))
      return 1;
    else {
      this.model.description = this.dealForm.get("description")?.value;
      this.model.products = Array.from(this.items?.value);
    }
    if (!this.model.description || !this.model.products ||
      this.model.description.length < 8 || this.model.products.length < 1) {
      return 1;
    }
    if (this.items.invalid) {
      return 2;
    }
    const prices = this.model.products.map((item) => item.Price);
    const sumPrices = prices.reduce((total, price) => total + price, 0);
    if (sumPrices < 5)
      return 3;
    return 4;
  }

  onTableDataChange(event: any) {
    this.currentPage = event;
  }
}
