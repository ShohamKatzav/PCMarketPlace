import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.css'],
})
export class CategoriesManagementComponent implements OnInit {

  categoriesNames: string[];
  categories$: Observable<Category[]>;
  categoryNameToAdd: string;
  categoryToEdit: string[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  totalItemsCount: number;

  constructor(private categoryService: CategoryService, private toastr: ToastrService) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit() {
    this.categories$.subscribe(categories => {
      this.categoriesNames = categories.map(cat => cat.name.toLowerCase());
      this.totalItemsCount = categories.length;
    });
  }

  addCategory(categoryToAdd: string) {
    if (!this.validateCategoryName(categoryToAdd)) {
      return;
    }
    const add$ = this.categoryService.addCategory(categoryToAdd);
    add$.subscribe(category => {
      if (category) {
        const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
        if (this.currentPage < totalPages) {
          this.currentPage = totalPages;
        }
        this.toastr.success('Category added successfully');
      }
      else {
        this.toastr.error('Failed to add the category');
      }
    })
  }
  removeCategory(categoryToDel: Category) {
    const indexCatToRemove = this.categoriesNames.findIndex(category => category == categoryToDel.name);
    var error;
    const remove$ = this.categoryService.removeCategory(categoryToDel.id);
    remove$.subscribe(res => {
      error = res;
      if (!error) {
        this.categoriesNames.splice(indexCatToRemove, 1);
        const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
        if (this.currentPage > totalPages) {
          this.currentPage = totalPages;
        }
        this.toastr.success('Category delete successfully');
      } else {
        this.toastr.error('Failed to delete the category');
      }
    })
  }
  editCategory(categoryToEdit: Category, newCategory: string) {
    const indexToReplace = this.categoriesNames.findIndex(category => category == categoryToEdit.name);
    const editedCategory: Category = { id: categoryToEdit.id, name: newCategory }
    if (!this.validateCategoryName(editedCategory.name)) {
      return;
    }
    var error;
    const edit$ = this.categoryService.editCategory(editedCategory);
    edit$.subscribe(res => {
        error = res;
        if (!error) {
          this.toastr.success('Category edited successfully');
          this.categoriesNames.splice(indexToReplace, 1, editedCategory.name);
        }
        else {
          this.toastr.error('Failed to edit the category');
        }
      });
  }

  onTableDataChange(event: any) {
    this.currentPage = event;
  }
  validateCategoryName(categoryName) {
    if (!categoryName?.trim()) {
      this.toastr.error("Please specify a category name");
      return false
    }
    if (this.categoriesNames.includes(categoryName.toLowerCase())) {
      this.toastr.error("Category name already exist");
      return false
    }
    return true;
  }
}
