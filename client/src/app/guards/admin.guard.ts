import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberService } from '../services/member.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private memberService: MemberService,
    private toastr: ToastrService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.memberService.currentMember$.pipe(
      map(member => {
        if (member.authorization=="Admin") return true;
        this.toastr.error('User not authorized');
        return false;
      })
    );
  }
  
}
