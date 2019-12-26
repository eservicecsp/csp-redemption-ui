import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

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

           
            //resolve(this.productTypes);
            this._httpClient.get(environment.apiBaseUrl + '/productType')
                .subscribe((response: any) => {
                    this.productTypes = response.productTypes;
                    this.onProductTypesChanged.next(this.productTypes);
                    resolve(response);
                }, reject);
            this.onProductTypesChanged.next(this.productTypes);
        });
    }
    getProductTypesById(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.productTypes = [];

           
            //resolve(this.productTypes);
            this._httpClient.get(environment.apiBaseUrl + '/productType/' + id)
                .subscribe((response: any) => {
                    this.productTypes = response.productTypes;
                    this.onProductTypesChanged.next(this.productTypes);
                    resolve(response);
                }, reject);
            this.onProductTypesChanged.next(this.productTypes);
        });
    }
    saveProductType(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/productType/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    updateProductType(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/productType/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
