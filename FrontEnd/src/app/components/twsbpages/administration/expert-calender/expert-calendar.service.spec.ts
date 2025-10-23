import { TestBed } from '@angular/core/testing';

import { ExpertCalendarService } from './expert-calendar.service';

describe('ExpertCalendarService', () => {
  let service: ExpertCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpertCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
