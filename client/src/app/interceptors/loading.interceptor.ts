import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs/operators';
import { SpinnerStatusService } from '../services/spinner-status.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerStatusService = inject(SpinnerStatusService);

  if (req.headers.get('Skip-Spinner')) {
    return next(req);
  }

  spinnerStatusService.busy();

  return next(req).pipe(
    delay(50),
    finalize(() => spinnerStatusService.idle())
  );
};