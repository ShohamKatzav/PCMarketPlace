import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  model: any = {};
  @Output() cancelRegister = new EventEmitter<boolean>();
  subscription: Subscription;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountService.register(this.model).subscribe(
      {
        next: res=>{
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
