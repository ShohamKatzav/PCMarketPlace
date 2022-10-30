import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { User } from "../models/user";
import { AccountService } from "../services/account.service";



@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private account: AccountService)
    {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser: User = {token: '', username: ''};
        this.account.currentUser$.pipe(take(1)).subscribe(user => currentUser = user)
        if (currentUser?.token){
            req = req.clone({
                setHeaders:{
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
        }
        return next.handle(req);
    }

}
