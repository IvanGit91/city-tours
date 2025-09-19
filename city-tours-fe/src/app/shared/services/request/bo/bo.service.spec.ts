import {TestBed} from '@angular/core/testing';

import {BoService} from './bo.service';

describe('BoService', () => {
  let service: BoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
