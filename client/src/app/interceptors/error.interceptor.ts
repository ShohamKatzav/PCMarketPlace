import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private toastr: ToastrService
    ) {

    }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                switch (err.status) {
                    case 400:
                        if (err.error.errors) {
                            const modelStateErrors = [];
                            for (const key in err.error.errors)
                                if (err.error.errors[key])
                                    modelStateErrors.push(err.error.errors[key])
                            throw modelStateErrors.flat();
                        }
                        else {
                            this.toastr.error(err.statusText === 'OK' ? 'BadRequest' : err.statusText, err.status);
                        }
                        break;
                    case 401:
                        this.toastr.error(err.statusText === 'OK' ? err.error || 'Unauthorized' : err.statusText, err.status);
                        break;
                    case 404:
                        this.router.navigateByUrl('/not-found');
                        break;
                    case 500:
                        const navigationExtras: NavigationExtras = { state: { error: err.error } };
                        this.router.navigateByUrl('/server-error', navigationExtras);
                        break;
                    default:
                        this.toastr.error('Something unexpected went wrong');
                        console.log(err);
                        break;
                }
                throw throwError(err);
            })
        )
    }
}