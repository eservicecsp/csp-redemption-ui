import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConfigurationsBrandsService implements Resolve<any>
{
    brands: any[];
    onBrandsChanged: BehaviorSubject<any>;

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
        this.onBrandsChanged = new BehaviorSubject({});

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
                this.getBrands()
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
    getBrands(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/brands')
                .subscribe((response: any) => {
                    if (response.isSuccess) {
                        this.brands = response.brands;
                        this.onBrandsChanged.next(this.brands);
                        resolve(response);
                    } else {
                        reject(response);
                    }
                }, reject);
        });
    }
    getBrandById(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/brands/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    createBrand(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/brands/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    updateBrand(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/brands/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    getBrand(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/brands/` + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
