import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/models/member';
import { MemberService } from 'src/app/services/member.service';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  imports: [
    CommonModule,
    MemberCardComponent
  ]
})
export class MemberListComponent implements OnInit {

  members$: Observable<Member[]>;
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.members$ = this.memberService.getMembers();
  }

  onImageError(event: any) {
    event.target.src = './assets/user.png';
  }

}
