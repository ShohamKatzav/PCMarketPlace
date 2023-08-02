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
  categoryToEdit: string[] = [];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  async addCategory(categoryToAdd: string) {
    await this.categoryService.addCategory(categoryToAdd).toPromise();
    this.categories$ = this.categoryService.getCategories();
    this.updateLocalStorage();
  }
  async removeCategory(categoryId: number) {
    await this.categoryService.removeCategory(categoryId).toPromise();
    this.categories$ = this.categoryService.getCategories();
    this.updateLocalStorage();
  }
  async editCategory(categoryToEdit: string, caregoryId: number) {
    var addId: Category = { "id": caregoryId, "name": categoryToEdit }
    await this.categoryService.editCategory(addId).toPromise();
    this.categories$ = this.categoryService.getCategories();
    this.updateLocalStorage();
  }
  async updateLocalStorage() {
    const categories = await this.categories$.toPromise();
    localStorage.setItem("categories", JSON.stringify(categories));
  }

}
