import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.css']
})
export class CategoriesManagementComponent implements OnInit {


  categories$: Observable<Category[]>;
  categoryNameToAdd: string;
  categoryToEdit:string[] = [];

  constructor(private categoryService: CategoryService) { 
    this.categoryToEdit = [];
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  addCategory(categoryToAdd: string) {
    this.categoryService.addCategory(categoryToAdd).subscribe(res =>
      this.categories$ = this.categoryService.getCategories()
    )
  }
  removeCategory(caregoryId: number) {
    this.categoryService.removeCategory(caregoryId).subscribe(res =>
      this.categories$ = this.categoryService.getCategories()
    );
  }
  editCategory(categoryToEdit: string,caregoryId: number) {
    var addId: Category ={"id":caregoryId,name:categoryToEdit}
    this.categoryService.editCategory(addId).subscribe(res =>
      this.categories$ = this.categoryService.getCategories()
    )
  }

}
