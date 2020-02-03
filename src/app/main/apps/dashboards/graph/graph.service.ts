import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class DasboardGraphService implements Resolve<any>
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
                //this.getBrands()
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
    GetGraph(data): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/charts/graph`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
