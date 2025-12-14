import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/services/member.service';

@Component({
  standalone: true,
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [
    CommonModule,
    TabsModule
  ]
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  memberSubscription: Subscription;

  constructor(private route: ActivatedRoute, private memberService: MemberService) { }

  onImageError(event: any) {
    event.target.src = './assets/user.png';
  }

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
