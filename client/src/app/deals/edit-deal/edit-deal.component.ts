import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, pipe } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Deal } from 'src/app/models/deal';
import { CategoryService } from 'src/app/services/category.service';
import { DealService } from 'src/app/services/deal.service';


@Component({
  selector: 'app-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.css']
})
export class EditDealComponent implements OnInit {
  @ViewChild('editForm') EForm: NgForm;
  formSubmitted = false;

  categories$: Observable<Category[]>;
  deal: Deal;
  dealSubscription: Subscription;
  model: any = {};
  items!: FormArray;
  dealForm: FormGroup;

  currentPage: number = 1;
  totalItemsCount: number = 0;

  constructor(private router: Router,
    private dealService: DealService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private categoryService: CategoryService) {
      this.dealSubscription = new Subscription();
  }

  ngOnInit() {
    this.deal = this.dealService.getSavedDeal();
    this.dealForm = new FormGroup({
      description: new FormControl('', Validators.required),
      products: new FormArray([]),
    });
    this.categories$ = this.categoryService.getCategories();
    this.loadDeal();
    this.totalItemsCount = this.deal.products.length;
  }

  getProducts() {
    return this.dealForm?.get("products") as FormArray;
  }
  getDescription() {
    return this.dealForm?.get("description")?.value as string;
  }
  addNewRow() {
    if (this.getProducts().controls.length < 10) {
      this.items = this.getProducts();
      this.items.push(this.genRow());
      this.items.length > 0 ? this.currentPage = ++this.totalItemsCount : this.currentPage = 1;
    }
    else
      this.toastr.warning("Sorry, maximum 10 products per deal.");
  }
  removeItem(index: any) {
    this.items.removeAt(index);
    this.deal.products.splice(index, 1);
    this.totalItemsCount -= 1;
    this.items.length > 0 && this.currentPage - 1 > 1 ? this.currentPage -= 1 : this.currentPage = 1;
  }


  initTheFormWithDealInfo() {
    const items: FormArray[] = [this.rowForEveryProduct()];
    this.dealForm?.patchValue({
      description: this.deal.description,
      products: items
    });
  }

  rowForEveryProduct(): FormArray {
    this.items = this.getProducts();
    for (let i = 0; i < this.deal.products.length; i++) {
      this.items?.push(
        this.fb.group(
          {
            Name: this.fb.control(this.deal.products[i].name, Validators.required),
            Category: new FormControl(this.deal.products[i].category, Validators.required),
            Price: new FormControl(this.deal.products[i].price, Validators.required),
          }));
    }
    return this.items;
  }



  genRow(): FormGroup {
    return new FormGroup({
      Name: new FormControl(null, Validators.required),
      Category: new FormControl(null, Validators.required),
      Price: new FormControl(null, Validators.required),
    });
  }

  clear() {
    this.dealForm.patchValue({
      description: "",
    });
    if (this.items)
      while (this.items.length > 0)
        this.removeItem(0);
  }

  edit() {
    this.model.id = this.deal.id;
    const validationResult = this.checkValidation();

    if (validationResult == 1)
      this.toastr.error("Please Enter description (8 characters) and at least 1 product");
    else if (validationResult == 2)
      this.toastr.warning("Please do not forget any field");
    else if (validationResult == 3)
      this.toastr.warning("Deal price has to be 5 ILS and above");
    else {
      this.model.description = this.dealForm.get("description")?.value;
      // attach products information exclude photos (name category and price)
      this.model.products = Array.from(this.items.value);
      // attach products photos information
      for (let i = 0; i < this.deal.products.length; i++) {
        this.model.products[i].productPhoto = this.deal.products[i]?.productPhoto;
      }
      // attach exist products id
      for (let i = 0; i < this.deal.products.length; i++) {
        // if id mean the product is already exist, else we won't send the id property(the server will create one). 
        if (this.deal.products[i].id)
          this.model.products[i].id = this.deal.products[i].id;
      }
      this.dealSubscription.add(this.dealService.edit(this.model).subscribe(pipe(() => {
        this.formSubmitted = true;
        this.toastr.success("Deal edited successfully");
        this.dealService.getDeal(this.deal.id).subscribe(deal => {
          this.deal = deal
          this.dealService.setSavedDeal(this.deal);
          this.router.navigate(['deals/view-deal']);
        });
      })));
    }
  }

  loadDeal() {
    this.initTheFormWithDealInfo();
  }

  checkValidation(): number {
    if (!this.dealForm.get("description")?.value || !Array.from(this.items.value))
      return 1;
    else {
      this.model.description = this.dealForm.get("description")?.value;
      this.model.products = Array.from(this.items.value);
    }
    if (!this.model.description || !this.model.products ||
      this.model.description.length < 8 || this.model.products.length < 1) {
      return 1;
    }
    if (this.items.invalid)
      return 2;
    const prices = this.model.products.map((item) => item.Price);
    const sumPrices = prices.reduce((total, price) => total + price, 0);
    if (sumPrices < 5)
      return 3;
    return 4;
  }

  onTableDataChange(event: any) {
    this.currentPage = event;
  }

  ngOnDestroy() {
    if (this.dealSubscription) {
      this.dealSubscription.unsubscribe();
    }
  }
}
