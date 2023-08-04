import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  model: any = {};
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  async register() {
    await this.accountService.register(this.model).toPromise();
    this.cancel();
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
