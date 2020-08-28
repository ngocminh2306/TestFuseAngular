import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Router } from '@angular/router';
import { JobTitleDetailService } from './job-title-detail.service';

@Component({
  selector: 'app-job-title-detail',
  templateUrl: './job-title-detail.component.html',
  styleUrls: ['./job-title-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class JobTitleDetailComponent implements OnInit {
  jobTitle: any;
  pageType: string;
  jobTitleForm: FormGroup;
  private _unsubscribeAll: Subject<any>;
  constructor(
    private jobTitleDetailService: JobTitleDetailService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private router: Router,
    private _matSnackBar: MatSnackBar) { 
      this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
      this.jobTitleDetailService.onJobTitleChanged
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe(data => {
                  console.log(data);
                  if ( data )
                  {
                      this.jobTitle = data;
                      this.pageType = 'edit';
                  }
                  else
                  {
                      this.pageType = 'new';
                      this.jobTitle = {};
                      this.jobTitle.id = "";
                      this.jobTitle.Code ="";
                      this.jobTitle.Name ="";
                      this.jobTitle.Description ="";
                  }
  
                  this.jobTitleForm = this.createJobTitleForm();
                  console.log(this.jobTitleForm);
              });
    }
    createJobTitleForm(): FormGroup
    {
        return this._formBuilder.group({
            id              : [this.jobTitle.id],
            Code            : [this.jobTitle.Code],
            Name            : [this.jobTitle.Name],
            Description     : [this.jobTitle.Description]
        });
    }
    saveJobTitle(): void
    {
      // debugger
      const data = this.jobTitleForm.getRawValue();
      // data.handle = FuseUtils.handleize(data.name);

      this.jobTitleDetailService.saveJobTitle(data)
          .then(() => {

              this.jobTitleDetailService.onJobTitleChanged.next(data);

              this._matSnackBar.open('Department saved', 'OK', {
                  verticalPosition: 'top',
                  duration        : 2000
              });
          });
    }
    addJobTitle(): void
    {
        const data = this.jobTitleForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);

        this.jobTitleDetailService.addJobTitle(data)
            .then(() => {

                // Trigger the subscription with new data
                this.jobTitleDetailService.onJobTitleChanged.next(data);

                // Show the success message
                this._matSnackBar.open('jobTitle added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this.router.navigate(['apps/e-commerce/job-title'], {queryParams: {newitem: this.jobTitle.id}});
                // this._location.go('apps/e-commerce/departments/' + this.department.id);
            });
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
