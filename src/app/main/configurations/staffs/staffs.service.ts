import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConfigurationsStaffsService implements Resolve<any>
{
    staffs: any[];
    onStaffsChanged: BehaviorSubject<any>;

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
        this.onStaffsChanged = new BehaviorSubject({});

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
                this.getStaffs()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get staffs
     *
     * @returns {Promise<any>}
     */
    getStaffs(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/staffs')
                .subscribe((response: any) => {
                    this.staffs = response.staffs;
                    this.onStaffsChanged.next(this.staffs);
                    resolve(response);
                }, reject);
        });
    }

    getRoles(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/roles')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    getStaff(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/staffs/staff/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    
    saveStaff(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/staffs/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    updateStaff(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/staffs/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

}
