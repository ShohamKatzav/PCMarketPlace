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
  private currentUserSource$ = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource$.asObservable();
  constructor(private http: HttpClient, private memberService: MemberService) {

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
    this.currentUserSource$.next();
    this.memberService.logout();
  }
  
}
