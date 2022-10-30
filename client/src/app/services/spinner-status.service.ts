import { Injectable } from '@angular/core';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerStatusService {
  busyRequestCount = 0

  constructor(private spinnerService: NgxSpinnerService) { };

  busy() {
    this.busyRequestCount++;
    const spinner: Spinner = {
      type: 'line-scale-party',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333'
    }
    this.spinnerService.show(undefined, spinner)
  }


  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }

}
