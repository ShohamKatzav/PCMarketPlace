
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from "rxjs/operators";
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { MemberService } from './member.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource$ = new ReplaySubject<User | null>(1);
  public currentUser$ = this.currentUserSource$.asObservable();

  constructor(private http: HttpClient, private memberService: MemberService) {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.currentUserSource$.next(user);
    } else {
      this.currentUserSource$.next(null);
    }
  }
  getCurrentUser(): User | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  login(model: any): Observable<any> {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any): Observable<any> {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource$.next(user);
    this.memberService.setCurrentMember(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource$.next(null);
    this.memberService.logout();
  }

}