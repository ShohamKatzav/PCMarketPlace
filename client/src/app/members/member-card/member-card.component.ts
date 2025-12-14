import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class MemberCardComponent implements OnInit {
  @Input() member!: Member;

  onImageError(event: any) {
    event.target.src = './assets/user.png';
  }

  constructor() { }

  ngOnInit(): void {
  }

}
