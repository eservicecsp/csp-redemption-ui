import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConfigurationsDealersService implements Resolve<any>
{
    dealers: any[];
    onDealersChanged: BehaviorSubject<any>;

    companyId: number;

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
        // Set the defaults
        this.onDealersChanged = new BehaviorSubject({});

        this.companyId = this._authenticationService.getRawAccessToken('companyId');
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
                this.getDealers()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get dealers
     *
     * @returns {Promise<any>}
     */
    getDealers(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/dealers')
                .subscribe((response: any) => {
                    if (response.isSuccess)
                    {
                        this.dealers = response.dealers;
                        this.onDealersChanged.next(this.dealers);
                        resolve(response);
                    }
                    else{
                        reject(response);
                    }
                }, reject);
        });
    }
    saveDealer(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/dealers/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    updateDealer(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/dealers/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    getDealer(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/dealers/` + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getProvinces(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/address/provinces')
                .subscribe((response: any) => {
                    if (response.isSuccess)
                    {
                        resolve(response);
                    }
                    else
                    {
                        reject(response);
                    }
                }, reject);
        });
    }

    getAmphurs(provinceCode: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/address/amphurs/' + provinceCode)
                .subscribe((response: any) => {
                    if (response.isSuccess)
                    {
                        resolve(response);
                    }
                    else
                    {
                        reject(response);
                    }
                }, reject);
        });
    }

    getTumbols(amphurCode: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/address/tumbols/' + amphurCode)
                .subscribe((response: any) => {
                    if (response.isSuccess)
                    {
                        resolve(response);
                    }
                    else
                    {
                        reject(response);
                    }
                }, reject);
        });
    }
}
