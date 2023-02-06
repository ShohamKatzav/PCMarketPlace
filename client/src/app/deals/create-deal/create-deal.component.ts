import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { DealService } from 'src/app/services/deal.service';

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements OnInit {

  categories: Category[];
  model : any = {};
  items!: FormArray;
  dealForm = new FormGroup({
    description: new FormControl('', Validators.required),
    products: new FormArray([])
  });
  constructor(private dealService: DealService) { }

  ngOnInit(): void {
    this.categories = JSON.parse(localStorage.getItem("categories") || '{}')
  }

  getProducts() {
    return this.dealForm.get("products") as FormArray;
  }
  addNewRow() {
    this.items = this.getProducts();
    this.items.push(this.genRow())
  }
  removeItem(index: any) {
    this.items = this.getProducts();
    this.items.removeAt(index)
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

  create() {
    this.model.description = this.dealForm.get("description")?.value;
    this.model.products = Array.from(this.items.value);
    this.dealService.create(this.model).subscribe();
  }


}
