import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  currentUser$?: Observable<User>;
  currentMember$: Observable<Member>;
  @ViewChild('sidemenu') myCheckbox: ElementRef<HTMLInputElement>;


  constructor(private accountService: AccountService, private memberService: MemberService,
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2) {
    this.currentUser$ = this.accountService.currentUser$;
  }

  async ngOnInit() {
    this.currentMember$ = await this.memberService.currentMember$;
    this.myCheckbox.nativeElement.checked = window.innerWidth <= 768 ? false : true;
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.toastr.success(this.model.username + " is logged in");
        this.router.navigateByUrl('/deals');
      }
    });
  }
  logout() {
    this.router.navigateByUrl('/');
    this.accountService.logout();
    this.closeNavbar();
  }


  closeNavbar() {
    if (window.innerWidth <= 768) {
      this.myCheckbox.nativeElement.checked = false;
      this.hideOrShowContent();
    }
  }
  hideOrShowContent() {
    const isChecked: boolean = this.myCheckbox.nativeElement.checked;
    if (isChecked)
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    else
      this.renderer.removeStyle(document.body, 'overflow');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 768)
      this.myCheckbox.nativeElement.checked = true;
    else
      this.myCheckbox.nativeElement.checked = false;
  }

  ngOnDestroy() {
    // Make sure to reset styles when the component is destroyed
    this.renderer.removeStyle(document.body, 'overflow');
  }

}




