import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
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
  calculatedMargin: number = 0;

  constructor(private http: HttpClient, private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userFromLS = localStorage.getItem('user');
    const user: User = userFromLS ? JSON.parse(userFromLS) : null;
    this.accountService.setCurrentUser(user);
  }
  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(
      response => { this.users = response; }
    )
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:load', ['$event'])
  onResize() {
    this.calculateNavbarHeight();
  }
  ngAfterContentChecked() {
    this.calculateNavbarHeight();
  }

  private calculateNavbarHeight() {
    this.calculatedMargin = document.querySelector('.navbar').clientHeight + (window.innerHeight * 0.05);
  }

}
