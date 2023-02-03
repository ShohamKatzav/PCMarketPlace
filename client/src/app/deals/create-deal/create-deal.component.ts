import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DealService } from 'src/app/services/deal.service';

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements OnInit {

  model = {"products":[]};
  items!: FormArray;
  createDealForm = new FormGroup({
     products: new FormArray([])
   });
 
 
   Addnewrow() {
     this.items = this.createDealForm.get("products") as FormArray;
     this.items.push(this.Genrow())
   }
   Removeitem(index:any){
     this.items = this.createDealForm.get("products") as FormArray;
     this.items.removeAt(index)
   }
 
   getProducts(){
     return this.createDealForm.get("products") as FormArray;
   }
 
   Genrow(): FormGroup {
     return new FormGroup({
      Name:new FormControl('',Validators.required),
      Category:new FormControl('',Validators.required),
      Price:new FormControl('',Validators.required),
     });
   }
  constructor(private dealService: DealService) { }

  ngOnInit(): void {
  }

  create() {
    this.model.products = Array.from(this.items.value);
    this.dealService.create(this.model).subscribe(
      {
        next: res=>{
          console.log(res);
        },
        error: error => {console.log(error);}
      }
    )
    console.log(this.model);
  }


}
