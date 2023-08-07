import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  currentMember$: Observable<Member>;
  

  constructor(private accountService: AccountService, private memberService: MemberService,
    private router: Router,
    private toastr: ToastrService) {
    this.currentUser$ = this.accountService.currentUser$;
  }

  async ngOnInit() {
    this.currentMember$ = await this.memberService.currentMember$;
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.toastr.success(this.model.username + " is logged in");
        this.router.navigateByUrl('/deals');
      }
    });
  }
  logout() {
    this.router.navigateByUrl('/');
    this.accountService.logout();
  }

}




