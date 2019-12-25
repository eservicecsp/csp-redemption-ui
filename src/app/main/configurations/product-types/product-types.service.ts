import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ConfigurationsProductTypesService implements Resolve<any>
{
    productTypes: any[];
    onProductTypesChanged: BehaviorSubject<any>;

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
        this.onProductTypesChanged = new BehaviorSubject({});
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
                this.getProductTypes()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get productTypes
     *
     * @returns {Promise<any>}
     */
    getProductTypes(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.productTypes = [];

            this.onProductTypesChanged.next(this.productTypes);
            resolve(this.productTypes);
            // this._httpClient.get('api/e-commerce-product-types')
            //     .subscribe((response: any) => {
            //         this.product-types = response;
            //         this.onProductTypesChanged.next(this.product-types);
            //         resolve(response);
            //     }, reject);
        });
    }
}
