import { TestBed, inject } from '@angular/core/testing';

import { EmployeeDetailService } from './employee-detail.service';

describe('EmployeeDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeDetailService]
    });
  });

  it('should be created', inject([EmployeeDetailService], (service: EmployeeDetailService) => {
    expect(service).toBeTruthy();
  }));
});
