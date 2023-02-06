import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Deal } from 'src/app/models/deal';
import { Product } from 'src/app/models/product';
import { DealService } from 'src/app/services/deal.service';


@Component({
  selector: 'app-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.css']
})
export class EditDealComponent implements OnInit {

  deal: Deal;
  products: Product[];
  model: any = {};
  items!: FormArray;
  dealForm: FormGroup;
  constructor(private route: ActivatedRoute, private dealService: DealService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadDeal();
    this.dealForm = new FormGroup({
      description: new FormControl('', Validators.required),
      products: new FormArray([]),
    });
  }

  getProducts() {
    return this.dealForm.get("products") as FormArray;
  }
  addNewRow() {
    this.items = this.getProducts();
    this.items.push(this.genRow());
  }
  removeItem(index: any) {
    this.items = this.getProducts();
    this.items.removeAt(index)
  }


  initTheFormWithDealInfo(deal: Deal) {
    var items2: FormArray[] = [this.rowForEveryProduct()];
    console.log(items2);
    this.dealForm.patchValue({
      description: deal.description,
      products: items2
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
    while (this.items.length > 0)
      this.removeItem(0);
  }

  edit() {
    this.model.id = this.deal.id;
    this.model.description = this.dealForm.get("description")?.value;
    this.model.products = Array.from(this.items.value);
    this.dealService.edit(this.model).subscribe();
  }

  loadDeal() {
    const dealid = this.route.snapshot.paramMap.get('dealid') as unknown;
    this.dealService.getDeal(dealid as number).subscribe(deal => {
      this.deal = deal;
      this.products = this.deal.products;
      this.initTheFormWithDealInfo(this.deal);
    });
  }
}
