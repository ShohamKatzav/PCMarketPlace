import { Component, inject, signal, effect, ElementRef, ViewChild, HostListener, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';
import { MemberService } from '../services/member.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, BsDropdownModule]
})
export class NavComponent implements OnInit, OnDestroy {
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private renderer = inject(Renderer2);
  private lastWidth = window.innerWidth;

  model: any = {};

  // Use Signals for state - cleaner than AsyncPipe
  currentUser = toSignal(this.accountService.currentUser$);
  currentMember = toSignal(this.memberService.currentMember$);

  @ViewChild('sidemenu') showNav!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    setTimeout(() => {
      if (this.showNav) {
        this.showNav.nativeElement.checked = window.innerWidth >= 768;
      }
    }, 0);
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.toastr.success(`${this.model.username} logged in`);
        this.router.navigateByUrl('/deals');
        this.model = {};
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.closeNavbar();
  }

  closeNavbar() {
    if (window.innerWidth < 768 && this.showNav) {
      this.showNav.nativeElement.checked = false;
      this.toggleBodyScroll(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleBodyScroll(isLocked: boolean) {
    if (isLocked) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  @HostListener('window:resize')
  onResize() {
    const currentWidth = window.innerWidth;
    if (currentWidth !== this.lastWidth) {
      this.lastWidth = currentWidth;

      const isDesktop = currentWidth >= 768;
      if (this.showNav) {
        this.showNav.nativeElement.checked = isDesktop;
        if (isDesktop) this.toggleBodyScroll(false);
      }
    }
  }

  ngOnDestroy() {
    this.toggleBodyScroll(false);
  }
}