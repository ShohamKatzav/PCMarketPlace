import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Observable } from 'rxjs';
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
  private route = inject(ActivatedRoute);
  private memberService = inject(MemberService);

  member$: Observable<Member>;

  onImageError(event: any) {
    event.target.src = './assets/user.png';
  }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.member$ = this.memberService.getMember(username);
    }
  }
}