import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DepartmentsService implements Resolve<any>
{
    departments: any[];
    onDepartmentChanged: BehaviorSubject<any>;
    constructor(
        private _httpClient: HttpClient
    )
    {
        this.onDepartmentChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getDepartments()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getDepartments(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/e-commerce-departments')
                .subscribe((response: any) => {
                    this.departments = response;
                    this.onDepartmentChanged.next(this.departments);
                    resolve(response);
                }, reject);
        });
    }
}
