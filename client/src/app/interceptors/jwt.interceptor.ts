import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);

    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;

    if (currentUser?.token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${currentUser.token}`
            }
        });
    }

    return next(req);
};