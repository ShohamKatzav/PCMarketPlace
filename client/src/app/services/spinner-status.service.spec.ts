import { TestBed } from '@angular/core/testing';

import { SpinnerStatusService } from './spinner-status.service';

describe('SpinnerStatusService', () => {
  let service: SpinnerStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
