import { TestBed } from '@angular/core/testing';

import { AvailavilityService } from './availavility.service';

describe('AvailavilityService', () => {
  let service: AvailavilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailavilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
