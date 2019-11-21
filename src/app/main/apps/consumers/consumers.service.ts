import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConsumersService implements Resolve<any>
{
    consumers: any[];
    onConsumersChanged: BehaviorSubject<any>;

    brandId: number;
    
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
        this.onConsumersChanged = new BehaviorSubject({});

        this.brandId = this._authenticationService.getRawAccessToken('brandId');
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
                this.getConsumers(this.brandId)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get consumers
     *
     * @returns {Promise<any>}
     */
    getConsumers(brandId): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.consumers = [];
            resolve(this.consumers);
            this._httpClient.get(environment.apiBaseUrl + '/consumers?brandId=' + brandId)
                .subscribe((response: any) => {
                    this.consumers = response.consumers;
                    this.onConsumersChanged.next(this.consumers);
                    resolve(response);
                }, reject);
        });
    }
}
