import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { SpinnerStatusService } from '../services/spinner-status.service'; 

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private spinnerStatusService: SpinnerStatusService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.get('Skip-Spinner')) {
      return next.handle(req);
    }

    // show the spinner
    this.spinnerStatusService.busy();

    return next.handle(req).pipe(
      // hide the spinner
      delay(50),
      finalize(() => this.spinnerStatusService.idle())
    );
  }

}
