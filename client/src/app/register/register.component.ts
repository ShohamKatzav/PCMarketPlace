import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class RegisterComponent {
  private accountService = inject(AccountService);

  model: any = {};
  @Output() cancelRegister = new EventEmitter<boolean>();
  subscription: Subscription;

  register() {
    this.accountService.register(this.model).subscribe(
      {
        next: res => {
          this.cancel();
        }
      }
    )
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
