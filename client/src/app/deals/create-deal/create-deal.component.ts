import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Deal } from 'src/app/models/deal';
import { Member } from 'src/app/models/member';
import { DealService } from 'src/app/services/deal.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements OnInit {

  deals$: Observable<Deal[]>;
  member: Member;

  categories: Category[];
  model: any = {};
  items!: FormArray;
  dealForm = new FormGroup({
    description: new FormControl('', Validators.required),
    products: new FormArray([])
  });
  constructor(private dealService: DealService, private memberService: MemberService , private toastr: ToastrService, private router: Router) {
    this.memberService.currentMember$.pipe(take(1)).subscribe(
      {
        next: response => {
          this.member = response;
          this.loadDeals();
        }
      }
    );
   }

  ngOnInit(): void {
    this.categories = JSON.parse(localStorage.getItem("categories") || '{}')
  }

  getProducts() {
    return this.dealForm.get("products") as FormArray;
  }
  getDescription() {
    return this.dealForm.get("description")?.value as string;
  }
  addNewRow() {
    if (this.getProducts().controls.length < 10)
    {
      this.items = this.getProducts();
      this.items.push(this.genRow());
    }
    else
      this.toastr.warning("Sorry, maximux 10 products per deal.");
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
    this.dealForm.patchValue({
      description: "",
    });
    if (this.items)
      while (this.items.length > 0)
        this.removeItem(0);
  }

  create() {
    if (this.checkValidation() == 1)
      this.toastr.error("Please Enter description (8 characters) and at least 1 product");

    else if (this.checkValidation() == 2)
      this.toastr.warning("Please do not forget any field");
    else {
      this.model.description = this.dealForm.get("description")?.value;
      this.model.products = Array.from(this.items.value);
      this.dealService.create(this.model).subscribe(() => {
        this.deals$ = this.dealService.getDealsForUser(this.member.id);
      });
      this.toastr.success("Deal created");
      this.router.navigateByUrl("/deals/my-deals");
    }
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
    return 3;
  }

  loadDeals() {
    this.deals$ = this.dealService.getDealsForUser(this.member.id);
  }


}
