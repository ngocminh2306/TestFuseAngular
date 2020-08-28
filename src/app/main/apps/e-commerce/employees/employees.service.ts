import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EmployeesService implements Resolve<any>
{
    employees: any[];
    onEmployeesChanged: BehaviorSubject<any>;
    constructor(
        private _httpClient: HttpClient
    )
    {
        this.onEmployeesChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getEmployees()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getEmployees(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/e-commerce-employees')
                .subscribe((response: any) => {
                    this.employees = response;
                    this.onEmployeesChanged.next(this.employees);
                    resolve(response);
                }, reject);
        });
    }
}
