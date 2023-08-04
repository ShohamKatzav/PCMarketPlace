import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<any> {

  constructor() { }
  canDeactivate(component: any): boolean {
    if (!component.formSubmitted) {
      if (component.EForm?.dirty) {
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
      }
    }
    return true;
  }

}
