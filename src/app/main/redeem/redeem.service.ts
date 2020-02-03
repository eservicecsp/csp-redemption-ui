import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class RedeemService {
    constructor(
        private _httpClient: HttpClient,
        private _authenticationService: AuthenticationService
    ) {}

    isExist(requestData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    environment.apiBaseUrl + '/redemption/isexist',
                    requestData
                )
                .subscribe((response: any) => {
                    if (response.isSuccess) {
                        // this.dealers = response.dealers;
                        // this.onDealersChanged.next(this.dealers);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }, reject);
        });
    }

    getProvinces(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiBaseUrl + '/address/provinces')
                .subscribe((response: any) => {
                    if (response.isSuccess) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }, reject);
        });
    }

    getAmphurs(provinceCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    environment.apiBaseUrl + '/address/amphurs/' + provinceCode
                )
                .subscribe((response: any) => {
                    if (response.isSuccess) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }, reject);
        });
    }

    getTumbols(amphurCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiBaseUrl + '/address/tumbols/' + amphurCode)
                .subscribe((response: any) => {
                    if (response.isSuccess) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }, reject);
        });
    }

    register(requestData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiBaseUrl + '/redemption', requestData)
                .subscribe((response: any) => {
                    if (response.isSuccess) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }, reject);
        });
    }
    getProductTypesByCampaignId(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiBaseUrl + '/campaigns/productType/' + id)
                .subscribe((response: any) => {
                    resolve(response.productTypes);
                }, reject);
        });
    }

    registerEnrollment(requestData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    environment.apiBaseUrl + '/redemption/enrollment',
                    requestData
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    registerConsumerEnrollment(requestData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    environment.apiBaseUrl + '/redemption/consumer',
                    requestData
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(navigator.geolocation);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        console.log(position);
                        resolve(position);
                    },
                    err => {
                        reject(err);
                    }
                );
            } else {
                reject();
            }
        });
    }

    checkQrCode(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve({
                message: 'This QR Code has been verified on',
                statusTypeCode: 'FAIL',
                scanDate: '2019-10-10 10:10:10',
                tel: '08x-xxxxxxx'
            });
        });
    }
}
