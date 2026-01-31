import { Component, inject, signal, computed } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  standalone: true,
  selector: 'app-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.css'],
  imports: [FormsModule, NgxPaginationModule]
})
export class CategoriesManagementComponent {
  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);

  // Bind to the service observable which is now a live NgRx selector
  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] });

  categoryNameToAdd = signal('');
  currentPage = signal(1);
  pageSize = signal(5); // Back to your original 5

  categoriesNames = computed(() =>
    this.categories().map(cat => cat.name.toLowerCase())
  );

  addCategory(categoryToAdd: string) {
    if (!this.validateCategoryName(categoryToAdd)) return;

    this.categoryService.addCategory(categoryToAdd).subscribe({
      next: (category) => {
        this.toastr.success('Category added successfully');
        this.categoryNameToAdd.set('');
        setTimeout(() => {
          const totalItems = this.categories().length;
          const lastPage = Math.ceil(totalItems / this.pageSize());
          this.currentPage.set(lastPage);
        }, 50);
      }
    });
  }

  removeCategory(categoryToDel: Category) {
    this.categoryService.removeCategory(categoryToDel.id).subscribe({
      next: () => {
        this.toastr.success('Category deleted successfully');
        setTimeout(() => {
          const totalItems = this.categories().length;
          const maxPages = Math.ceil(totalItems / this.pageSize()) || 1;

          if (this.currentPage() > maxPages) {
            this.currentPage.set(maxPages);
          }
        }, 50);
      },
      error: () => this.toastr.error('Failed to delete the category')
    });
  }

  editCategory(categoryToEdit: Category, newName: string) {
    if (categoryToEdit.name === newName) return;
    if (!this.validateCategoryName(newName)) return;

    const editedCategory: Category = { id: categoryToEdit.id, name: newName };
    this.categoryService.editCategory(editedCategory).subscribe({
      next: () => this.toastr.success('Category edited successfully'),
      error: () => this.toastr.error('Failed to edit the category')
    });
  }

  onTableDataChange(event: number) {
    this.currentPage.set(event);
  }

  validateCategoryName(name: string) {
    if (!name?.trim()) {
      this.toastr.error("Please specify a category name");
      return false;
    }
    if (this.categoriesNames().includes(name.toLowerCase())) {
      this.toastr.error("Category name already exists");
      return false;
    }
    return true;
  }
}