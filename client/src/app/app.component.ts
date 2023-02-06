import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PC Marketplace';
  users: any;

  constructor(private http: HttpClient, private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.setCurrentUser();
    this.getCategories();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(
      {
        next: response => { this.users = response; },
        error: error => { console.log(error); },
        complete: () => { console.log('Finished'); }
      }
    )
  }

  setCurrentUser() {
    const userFromLS = localStorage.getItem('user');
    const user: User = userFromLS ? JSON.parse(userFromLS) : null;
    this.accountService.setCurrentUser(user);
  }

  getCategories() {
    this.http.get('https://localhost:5001/api/category').subscribe(
      {
        next: response => { localStorage.setItem("categories", JSON.stringify(response)); }
      }
    );
  }
}
