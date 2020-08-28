import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Router } from '@angular/router';
import { DepartmentDetailService } from './department.detail.service';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DepartmentDetailComponent implements OnInit {
  department: any;
  pageType: string;
  departmentForm: FormGroup;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _departmentDetailService: DepartmentDetailService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private router: Router,
    private _matSnackBar: MatSnackBar
  ) {

       this._unsubscribeAll = new Subject();
   }

  ngOnInit() {
    this._departmentDetailService.onDepartmentChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(department => {
                console.log(department);
                if ( department )
                {
                    this.department = department;
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.department = {};
                    this.department.id = "";
                    this.department.Code ="";
                    this.department.Name ="";
                    this.department.CreateDate = "";
                    this.department.Description ="";
                }

                this.departmentForm = this.createProductForm();
                console.log(this.departmentForm);
            });
  }
  createProductForm(): FormGroup
  {
      return this._formBuilder.group({
          id              : [this.department.id],
          Code            : [this.department.Code],
          Name            : [this.department.Name],
          CreateDate      : [this.department.CreateDate],
          Description     : [this.department.Description]
      });
  }
  saveProduct(): void
    {
      // debugger
      const data = this.departmentForm.getRawValue();
      // data.handle = FuseUtils.handleize(data.name);

      this._departmentDetailService.saveDepartment(data)
          .then(() => {

              this._departmentDetailService.onDepartmentChanged.next(data);

              this._matSnackBar.open('Department saved', 'OK', {
                  verticalPosition: 'top',
                  duration        : 2000
              });
          });
    }
    addProduct(): void
    {
        const data = this.departmentForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);

        this._departmentDetailService.addDepartment(data)
            .then(() => {

                // Trigger the subscription with new data
                this._departmentDetailService.onDepartmentChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Department added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this.router.navigate(['apps/e-commerce/departments'], {queryParams: {newitem: this.department.id}});
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
