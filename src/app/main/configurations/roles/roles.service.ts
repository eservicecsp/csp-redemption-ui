import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';

@Injectable()
export class ConfigurationsRolesService implements Resolve<any>
{
    roles: any[];
    onRolesChanged: BehaviorSubject<any>;

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
        this.onRolesChanged = new BehaviorSubject({});

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
                this.getRoles()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get roles
     *
     * @returns {Promise<any>}
     */
    getRoles(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/roles')
                .subscribe((response: any) => {
                    if (response.isSuccess){
                        this.roles = response.roles;
                        this.onRolesChanged.next(this.roles);
                        resolve(response);
                    } else{
                        reject(response);
                    }
                }, reject);
        });
    }

    getRoleById(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/roles/' + id)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    
    getChildFunctions(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/functions?type=all')
            .subscribe(response => {
                resolve(response);
            }, reject);
        });
    }

    createRole(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/roles/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    saveRole(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/roles/create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    updateRole(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/roles/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

}
