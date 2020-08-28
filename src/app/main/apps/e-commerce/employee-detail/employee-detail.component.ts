import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormControlName } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Router } from '@angular/router';
import { EmployeeDetailService } from './employee-detail.service';
import { DepartmentsService } from '../deparment/departments.service';
import { JobTitlesService } from '../job-title/job-title.service';
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class EmployeeDetailComponent implements OnInit {
  employee: any;
  pageType: string;
  employeeForm: FormGroup;
  jobTitlesOpt: any;
  departmentsOpt: any;
  private _unsubscribeAll: Subject<any>;
  constructor( 
    private _employeeDetailService: EmployeeDetailService,
    private _departmentsService: DepartmentsService,
    private _jobTitlesService: JobTitlesService,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private router: Router,
    private _matSnackBar: MatSnackBar) { 
      this._unsubscribeAll = new Subject();
      this._jobTitlesService.getJobTitles().then(data =>{
        this.jobTitlesOpt = data;
      })
      this._departmentsService.getDepartments().then(data =>{
        this.departmentsOpt = data;
      })
    }

    ngOnInit() {
      this._employeeDetailService.onEmployeeChanged
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe(department => {
                  console.log(department);
                  if ( department )
                  {
                      this.employee = department;
                      this.pageType = 'edit';
                  }
                  else
                  {
                      this.pageType = 'new';
                      this.employee = {};
                      this.employee.id = "";
                      this.employee.Code ="";
                      this.employee.Name ="";
                      this.employee.Description ="";
                  }
  
                  this.employeeForm = this.createEmployeeForm();
                  this.employee.Titles.forEach(element => {
                    this.addTitlesFromArray(element.DepartmentCode,element.JobTitleCode)
                  });
              });
    }
    addTitlesFromArray(departmentCode, jobTitleCode) {
      this.titlesFromArray.push(this._formBuilder.group({
        DepartmentCode: departmentCode,
        JobTitleCode: jobTitleCode,
      }));
    }
    createEmployeeForm(): FormGroup
    {
        return this._formBuilder.group({
            id              : [this.employee.id],
            Code            : [this.employee.Code],
            Name            : [this.employee.Name],
            Description     : [this.employee.Description],
            Titles          : new FormArray([])
        });
    }
    get titlesFromArray():  FormArray{
      return (this.employeeForm.get("Titles") as FormArray);
    } 
    saveProduct(): void
    {
      // debugger
      const data = this.employeeForm.getRawValue();
      // data.handle = FuseUtils.handleize(data.name);

      this._employeeDetailService.saveEmployee(data)
          .then(() => {

              this._employeeDetailService.onEmployeeChanged.next(data);

              this._matSnackBar.open('Department saved', 'OK', {
                  verticalPosition: 'top',
                  duration        : 2000
              });
          });
    }
    addProduct(): void
    {
        const data = this.employeeForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);

        this._employeeDetailService.addEmployee(data)
            .then(() => {

                // Trigger the subscription with new data
                this._employeeDetailService.onEmployeeChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Department added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this.router.navigate(['apps/e-commerce/employees'], {queryParams: {newitem: this.employee.id}});
            });
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
