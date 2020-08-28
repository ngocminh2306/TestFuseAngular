import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailService {
  routeParams: any;
  employee: any;
  onEmployeeChanged: BehaviorSubject<any>;
  constructor(
    private _httpClient: HttpClient
  )
  {
      this.onEmployeeChanged = new BehaviorSubject({});
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getJobTitle()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }
    getJobTitle(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onEmployeeChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get('api/e-commerce-employees/' + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.employee = response;
                        this.onEmployeeChanged.next(this.employee);
                        resolve(response);
                    }, reject);
            }
        });
    }
    saveEmployee(employee): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-employees/' + employee.id, employee)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add product
     *
     * @param product
     * @returns {Promise<any>}
     */
    addEmployee(employee): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-employees/', employee)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
