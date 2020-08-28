import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleDetailComponent } from './job-title-detail.component';

describe('JobTitleDetailComponent', () => {
  let component: JobTitleDetailComponent;
  let fixture: ComponentFixture<JobTitleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTitleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
