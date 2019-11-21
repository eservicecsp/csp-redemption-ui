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
                this.getDealers(this.companyId)
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
    getDealers(dealerId): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.dealers = [];
            resolve(this.dealers);
            // this._httpClient.get(environment.apiBaseUrl + '/company?dealerId=' + dealerId)
            //     .subscribe((response: any) => {
            //         this.dealers = response.dealers;
            //         this.onDealersChanged.next(this.dealers);
            //         resolve(response);
            //     }, reject);
        });
    }
}
