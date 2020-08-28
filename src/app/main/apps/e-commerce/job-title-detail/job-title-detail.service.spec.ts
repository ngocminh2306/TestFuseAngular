import { TestBed, inject } from '@angular/core/testing';

import { JobTitleDetailService } from './job-title-detail.service';

describe('JobTitleDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobTitleDetailService]
    });
  });

  it('should be created', inject([JobTitleDetailService], (service: JobTitleDetailService) => {
    expect(service).toBeTruthy();
  }));
});
