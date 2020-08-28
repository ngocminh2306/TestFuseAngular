import { TestBed, inject } from '@angular/core/testing';

import { JobTitlesService } from './job-title.service';

describe('JobTitleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobTitlesService]
    });
  });

  it('should be created', inject([JobTitlesService], (service: JobTitlesService) => {
    expect(service).toBeTruthy();
  }));
});
