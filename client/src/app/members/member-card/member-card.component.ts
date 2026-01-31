import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  member = input.required<Member>();

  onImageError(event: any) {
    event.target.src = './assets/user.png';
  }
}