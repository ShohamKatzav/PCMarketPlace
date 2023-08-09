import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  memberSubscription: Subscription;

  constructor(private route: ActivatedRoute, private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadMember();
  }

  async loadMember() {
    const username = this.route.snapshot.paramMap.get('username') as string;
    this.memberSubscription = this.memberService.getMember(username).subscribe(member => this.member = member);
  }

  ngOnDestroy() {
    if (this.memberSubscription) {
      this.memberSubscription.unsubscribe();
    }
  }


}
