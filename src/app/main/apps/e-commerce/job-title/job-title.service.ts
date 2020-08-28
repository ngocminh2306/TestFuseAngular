import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class JobTitlesService implements Resolve<any>
{
    jobTitles: any[];
    onJobTitlesChanged: BehaviorSubject<any>;
    constructor(
        private _httpClient: HttpClient
    )
    {
        this.onJobTitlesChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getJobTitles()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }
    getEmployees(jobTitleId): Observable<any> {
        return this._httpClient.get('api/e-commerce-employees');
    }

    getJobTitles(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/e-commerce-jobTitle')
                .subscribe((response: any) => {
                    this.jobTitles = response;
                    this.onJobTitlesChanged.next(this.jobTitles);
                    resolve(response);
                }, reject);
        });
    }
}
