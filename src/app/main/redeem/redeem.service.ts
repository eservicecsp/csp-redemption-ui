import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class RedeemService
{
    // dealers: any[];
    // onDealersChanged: BehaviorSubject<any>;

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
        // this.onDealersChanged = new BehaviorSubject({});
    }

    /**
     * Check is existing
     *
     * @returns {Promise<any>}
     */
    isExist(requestData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/redemption/isexist', requestData)
                .subscribe((response: any) => {
                    if (response.isSuccess)
                    {
                        // this.dealers = response.dealers;
                        // this.onDealersChanged.next(this.dealers);
                        resolve(response);
                    }
                    else{
                        reject(response);
                    }
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

    register(requestData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/redemption', requestData)
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
