import { Component, inject, signal, viewChild, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models/member';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { PhotoChangeComponent } from '../photo-change/photo-change.component';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, TabsModule, PhotoChangeComponent, DatePipe]
})
export class MemberEditComponent implements OnInit {
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  editForm = viewChild<NgForm>('editForm');

  member = signal<Member | null>(null);
  user = toSignal(this.accountService.currentUser$);

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm()?.dirty) {
      $event.returnValue = true;
    }
  }

  ngOnInit() {
    const state = history.state;

    if (state && state['OtherUser']) {
      this.member.set(state['OtherUser']);
    } else {
      this.loadMember();
    }
  }

  loadMember() {
    const currentUser = this.user();
    if (currentUser) {
      this.memberService.getMember(currentUser.username).subscribe({
        next: m => {
          const memberClone = JSON.parse(JSON.stringify(m));
          this.member.set(memberClone);
        }
      });
    }
  }

  updateMember() {
    const m = this.member();
    const form = this.editForm();
    if (!m || !form) return;

    this.memberService.updateMember(m).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        form.reset(m);
      }
    });
  }

  onImageError(event: any) {
    event.target.src = './assets/user.png';
  }
}