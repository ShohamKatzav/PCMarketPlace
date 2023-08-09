import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, of, pipe, } from 'rxjs';
import { take } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.css']
})
export class CategoriesManagementComponent implements OnInit {

  categories$: Observable<Category[]>;
  categoriesSubscription: Subscription;
  categories: Category[];
  categoryNameToAdd: string;
  categoryToEdit: string[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  totalItemsCount: number;

  constructor(private categoryService: CategoryService, private toastr: ToastrService) {
    this.categoriesSubscription = new Subscription();
  }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
    this.categoriesSubscription.add(this.categories$.pipe(take(1)).subscribe(categories => this.categories = categories));
    this.totalItemsCount = this.categories.length;
  }

  async addCategory(categoryToAdd: string) {
    if (!this.validateCategoryName(categoryToAdd, this.categories)) {
      return;
    }
    var newCategory;
    this.categoriesSubscription.add(this.categoryService.addCategory(categoryToAdd).pipe(take(1))
      .subscribe(category => {
        newCategory = category;
        if (newCategory) {
          this.categories.push(newCategory);
          const totalPages = Math.ceil(++this.totalItemsCount / this.pageSize);
          if (this.currentPage < totalPages) {
            this.currentPage = totalPages;
          }
          this.toastr.success('Category added successfully');
          this.updateLocalStorage(this.categories);
        } else {
          this.toastr.error('Failed to add the category');
        }
      }));
  }
  async removeCategory(categoryId: number) {
    const indexCatToRemove = this.categories.findIndex(category => category.id == categoryId);
    var error;
    this.categoriesSubscription.add(this.categoryService.removeCategory(categoryId).pipe(take(1))
      .subscribe(res => {
        error = res;
        if (!error) {
          this.categories.splice(indexCatToRemove, 1);
          const totalPages = Math.ceil(--this.totalItemsCount / this.pageSize);
          if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
          }
          this.toastr.success('Category delete successfully');
          this.updateLocalStorage(this.categories);
        } else {
          this.toastr.error('Failed to delete the category');
        }
      }));
  }
  async editCategory(caregoryId: number, categoryToEdit: string) {
    const indexToReplace = this.categories.findIndex(category => category.id == caregoryId);
    const editedCategory: Category = { id: caregoryId, name: categoryToEdit }
    if (!this.validateCategoryName(editedCategory.name, this.categories)) {
      return;
    }
    var error;
    this.categoriesSubscription.add(this.categoryService.editCategory(editedCategory).pipe(take(1))
      .subscribe(res => {
        error = res;
        if (!error) {
          this.toastr.success('Category edited successfully');
          this.categories.splice(indexToReplace, 1, editedCategory);
          this.updateLocalStorage(this.categories);
        }
        else {
          console.log(error);
          this.toastr.error('Failed to edit the category');
        }
      }));
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
  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}
