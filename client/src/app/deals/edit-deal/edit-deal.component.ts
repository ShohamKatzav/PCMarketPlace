import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { Product } from 'src/app/models/product';
import { DealService } from 'src/app/services/deal.service';
import { MemberService } from 'src/app/services/member.service';


@Component({
  selector: 'app-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.css']
})
export class EditDealComponent implements OnInit {
  member: Member;
  categories: Category[];
  deal: Deal;
  products: Product[];
  model: any = {};
  items!: FormArray;
  dealForm: FormGroup;

  constructor(private route: ActivatedRoute, private dealService: DealService,
    private memberService: MemberService, private fb: FormBuilder,
    private toastr: ToastrService, private router: Router) {
    this.memberService.currentMember$.pipe(take(1)).subscribe(
      {
        next: response => {
          this.member = response;
        }
      }
    );
  }

  ngOnInit(): void {
    this.loadDeal();
    this.dealForm = new FormGroup({
      description: new FormControl('', Validators.required),
      products: new FormArray([]),
    });
    this.categories = JSON.parse(localStorage.getItem("categories") || '{}')
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
    }
    else
      this.toastr.warning("Sorry, maximum 10 products per deal.");
  }
  removeItem(index: any) {
    this.items.removeAt(index);
    this.products.splice(index);
  }


  initTheFormWithDealInfo(deal: Deal) {
    var items: FormArray[] = [this.rowForEveryProduct()];
    this.dealForm.patchValue({
      description: deal.description,
      products: items
    });
  }

  rowForEveryProduct(): FormArray {
    this.items = this.getProducts();
    for (let i = 0; i < this.deal.products.length; i++) {
      this.items.push(
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
      Name: new FormControl('', Validators.required),
      Category: new FormControl('', Validators.required),
      Price: new FormControl('', Validators.required),
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
      for (let i = 0; i < this.products.length; i++) {
        this.model.products[i].productPhoto = this.products[i].productPhoto;
      }
      // attach exist products id
      for (let i = 0; i < this.products.length; i++) {
        // if id mean the product is already exist, else we won't send the id property(the server will create one). 
        if (this.products[i].id)
          this.model.products[i].id = this.products[i].id;
      }
      this.dealService.edit(this.model).subscribe(() => {
        this.router.navigateByUrl("/deals/my-deals");
        this.toastr.success("Deal edited successfully");
      });
    }
  }

  loadDeal() {
    const dealid = this.route.snapshot.paramMap.get('dealid') as unknown;
    this.dealService.getDeal(dealid as number).subscribe(deal => {
      this.deal = deal;
      this.products = this.deal.products;
      this.initTheFormWithDealInfo(this.deal);
    });
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


}
