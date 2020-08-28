import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class JobTitleDetailService {
    routeParams: any;
    jobTitle: any;
    onJobTitleChanged: BehaviorSubject<any>;
    constructor(
      private _httpClient: HttpClient
    )
    {
        this.onJobTitleChanged = new BehaviorSubject({});
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
                this.onJobTitleChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get('api/e-commerce-jobTitle/' + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.jobTitle = response;
                        this.onJobTitleChanged.next(this.jobTitle);
                        resolve(response);
                    }, reject);
            }
        });
    }
    saveJobTitle(jobTitle): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-jobTitle/' + jobTitle.id, jobTitle)
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
    addJobTitle(jobTitle): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-jobTitle/', jobTitle)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
