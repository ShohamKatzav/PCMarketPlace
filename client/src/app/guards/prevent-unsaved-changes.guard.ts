import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<any> {

  canDeactivate(component: any): boolean {
    const form = component.editForm?.() || component.dealForm || component.EForm;

    if (form?.dirty && !component.formSubmitted) {
      return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
    }
    return true;
  }

}
