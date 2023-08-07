import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, pipe, } from 'rxjs';
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

  currentPage: number = 1;
  pageSize: number = 5;
  totalItemsCount: number;

  constructor(private categoryService: CategoryService, private toastr: ToastrService) {
  }

  async ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
    const categories = await this.categories$.toPromise();
    this.totalItemsCount = categories.length;
  }

  async addCategory(categoryToAdd: string) {
    const categories = await this.categories$.toPromise();
    if (!this.validateCategoryName(categoryToAdd, categories)) {
      return;
    }
    const newCategory = await this.categoryService.addCategory(categoryToAdd).toPromise();
    if (newCategory) {
      categories.push(newCategory);
      const totalPages = Math.ceil(++this.totalItemsCount / this.pageSize);
      if (this.currentPage < totalPages) {
        this.currentPage = totalPages;
      }
      this.toastr.success('Category added successfully');
      this.updateLocalStorage(categories);
    } else {
      this.toastr.error('Failed to add the category');
    }
  }
  async removeCategory(categoryId: number) {
    const categories = await this.categories$.toPromise()
    const indexCatToRemove = categories.findIndex(category => category.id == categoryId);
    const error = await this.categoryService.removeCategory(categoryId).toPromise();
    if (!error) {
      categories.splice(indexCatToRemove, 1);
      const totalPages = Math.ceil(--this.totalItemsCount / this.pageSize);
      if (this.currentPage > totalPages) {
        this.currentPage = totalPages;
      }
      this.toastr.success('Category delete successfully');
      this.updateLocalStorage(categories);
    } else {
      this.toastr.error('Failed to delete the category');
    }
  }
  async editCategory(caregoryId: number, categoryToEdit: string) {
    const categories = await this.categories$.toPromise()
    const indexToReplace = categories.findIndex(category => category.id == caregoryId);
    const editedCategory: Category = { id: caregoryId, name: categoryToEdit }
    if (!this.validateCategoryName(editedCategory.name, categories)) {
      return;
    }
    const error = await this.categoryService.editCategory(editedCategory).toPromise();
    if (!error) {
      this.toastr.success('Category edited successfully');
      categories.splice(indexToReplace, 1, editedCategory);
      this.updateLocalStorage(categories);
    }
    else {
      console.log(error);
      this.toastr.error('Failed to edit the category');
    }
  }
  async updateLocalStorage(categories) {
    localStorage.setItem("categories", JSON.stringify(categories));
  }

  onTableDataChange(event: any) {
    this.currentPage = event;
  }
  validateCategoryName(categoryName, categories) {
    if (!categoryName?.trim()) {
      this.toastr.error("Please specify a category name");
      return false
    }
    if (categories.some(category => category.name == categoryName)) {
      this.toastr.error("Category name already exist");
      return false
    }
    return true;
  }
}
