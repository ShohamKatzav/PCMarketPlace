import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MemberService } from 'src/app/services/member.service';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  standalone: true,
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  imports: [CommonModule, MemberCardComponent, FormsModule]
})
export class MemberListComponent {
  private memberService = inject(MemberService);

  private membersRaw = toSignal(this.memberService.getMembers(), { initialValue: [] });

  searchTerm = signal('');

  filteredMembers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.membersRaw().filter(m =>
      m.userName.toLowerCase().includes(term) ||
      m.knownAs?.toLowerCase().includes(term)
    );
  });

}