import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  private currentMemberSource$ = new ReplaySubject<Member>(1);
  public currentMember$ = this.currentMemberSource$.asObservable();

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}users`).pipe(tap(members => this.members = members));
  }

  getMember(username: string): Observable<Member> {
    const member = this.members.find(x => x.userName === username);
    if (member !== undefined) return of(member);

    return this.http.get<Member>(`${this.baseUrl}users/${username}`).pipe(tap(member => this.members.push(member)));
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}users`, member).pipe(tap(() => {
      console.log(member)
      const index = this.members.indexOf(member);
      this.members[index] = member;
    }));
  }
  deletePhoto(photoId: number, userName: string) {
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photoId}`, {headers: {"UserName":userName.toString()}});
  }

  setCurrentMember(user: User) {
    if (user) {
      this.getMember(user.username).subscribe(member => {
        localStorage.setItem('member', JSON.stringify(member));
        this.currentMemberSource$.next(member);
      })
    }
  }

  logout() {
    localStorage.removeItem('member');
    this.currentMemberSource$.next();
  }
}
