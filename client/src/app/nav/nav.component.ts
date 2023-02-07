import { Component, OnInit } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  currentUser$?: Observable<User>;
  currentMember: Member;
  

  constructor(private accountService: AccountService, private memberService: MemberService,
    private router: Router,
    private toastr: ToastrService) {
    this.currentUser$ = this.accountService.currentUser$;
  }

  ngOnInit(): void {
    this.memberService.currentMember$.subscribe( res => this.currentMember = res);
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        this.toastr.success("Success")
        this.router.navigateByUrl('/deals');
      }
    });
  }
  logout() {
    this.router.navigateByUrl('/');
    this.accountService.logout();
  }

  myMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };
}




