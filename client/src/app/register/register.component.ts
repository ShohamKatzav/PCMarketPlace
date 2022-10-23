import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  model: any = {};
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(private accountServise: AccountService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountServise.register(this.model).subscribe(
      {
        next: res=>{
          this.cancel();
          console.log(res);
        },
        error: error => {console.log(error);}
      }
    )
    console.log(this.model);
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
