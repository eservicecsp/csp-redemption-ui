import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConfigurationsContactUsService implements Resolve<any>
{


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _authenticationService: AuthenticationService,
    )
    {

    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get brands
     *
     * @returns {Promise<any>}
     */
    getContactUs(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/contactus')
                .subscribe((response: any) => {
                    if (response.isSuccess) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }, reject);
        });
    }
    saveContactUs(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/contactus/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    updateContactUs(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/contactus/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
