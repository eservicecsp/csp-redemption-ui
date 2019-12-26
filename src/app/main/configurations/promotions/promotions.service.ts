import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConfigurationsPromotionsService implements Resolve<any>
{
    promotions: any[];
    onPromotionsChanged: BehaviorSubject<any>;

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
        this.onPromotionsChanged = new BehaviorSubject({});

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
                this.getPromotions()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get promotions
     *
     * @returns {Promise<any>}
     */
    getPromotions(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/promotions')
                .subscribe((response: any) => {
                    if (response.isSuccess)
                    {
                        this.promotions = response.promotions;
                        this.onPromotionsChanged.next(this.promotions);
                        resolve(response);
                    }
                    else{
                        reject(response);
                    }
                }, reject);
        });
    }

    getPromotionById(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/promotions/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    createPromotion(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/promotions/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    updatePromotion(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/promotions/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getPromotionTypes(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/promotiontypes`)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
