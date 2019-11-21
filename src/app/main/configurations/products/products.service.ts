import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConfigurationsProductsService implements Resolve<any>
{
    products: any[];
    onProductsChanged: BehaviorSubject<any>;

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
        this.onProductsChanged = new BehaviorSubject({});

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
                this.getProducts(this.companyId)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getProducts(companyId): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.products = [];
            resolve(this.products);
            // this._httpClient.get(environment.apiBaseUrl + '/products?companyId=' + companyId)
            //     .subscribe((response: any) => {
            //         this.products = response.products;
            //         this.onProductsChanged.next(this.products);
            //         resolve(response);
            //     }, reject);
        });
    }
}
