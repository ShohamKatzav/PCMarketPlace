import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first, take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  member: Member;
  user: User;

  OtherUser: Member;

  @ViewChild('editForm') EForm: NgForm;

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.EForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private accountService: AccountService,
    private memberService: MemberService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const state = this.router.getCurrentNavigation().extras.state;
    if(state)
      this.OtherUser = state['OtherUser'];
  }

  async ngOnInit() {
    const user$ = this.accountService.currentUser$.pipe(first());
    this.user = await user$.toPromise();
    this.loadMember();
  }

  async loadMember() {
    if (this.OtherUser)
      this.member = this.OtherUser;
    else
    {
      const member$ = this.memberService.getMember(this.user.username);
      this.member = await member$.toPromise();
    }  
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.memberService.setCurrentMember(this.user);
      this.toastr.success('Profile updated successfully');
      this.EForm.reset(this.member);
    })
  }
}
