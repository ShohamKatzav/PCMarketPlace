import { Component } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { SharedModule } from './modules/shared.module';
import { FooterComponent } from './footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    SharedModule,
    NavComponent,
    FooterComponent
  ]
})
export class AppComponent {
  title = 'PC Marketplace';
  users: any;

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userFromLS = localStorage.getItem('user');
    const user: User = userFromLS ? JSON.parse(userFromLS) : null;
    this.accountService.setCurrentUser(user);
  }

}
