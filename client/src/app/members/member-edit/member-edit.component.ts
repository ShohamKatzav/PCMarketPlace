import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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
  subscription: Subscription;

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
    this.subscription = new Subscription();
    const state = this.router.getCurrentNavigation().extras.state;
    if (state)
      this.OtherUser = state['OtherUser'];
  }

  async ngOnInit() {
    this.subscription.add(this.accountService.currentUser$.subscribe(user => {
      this.user = user
      this.loadMember();
    }));
  }

  async loadMember() {
    if (this.OtherUser)
      this.member = this.OtherUser;
    else {
      this.subscription.add(this.memberService.getMember(this.user.username).subscribe( member => this.member = member));
    }
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.memberService.setCurrentMember(this.user);
      this.toastr.success('Profile updated successfully');
      this.EForm.reset(this.member);
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
