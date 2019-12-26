import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class ConfigurationsPromotionTypesService implements Resolve<any>
{
    promotionTypes: any[];
    onPromotionTypesChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onPromotionTypesChanged = new BehaviorSubject({});
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
                this.getPromotionTypes()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get promotionTypes
     *
     * @returns {Promise<any>}
     */
    getPromotionTypes(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/promotionTypes`)
                .subscribe((response: any) => {
                    if (response.isSuccess)
                    {
                        this.promotionTypes = response.promotionTypes;
                        this.onPromotionTypesChanged.next(this.promotionTypes);
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
