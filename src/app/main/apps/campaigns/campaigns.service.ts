import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class CampaignsService implements Resolve<any>
{
    campaigns: any[];
    widgets: any[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
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
                //this.getCampaigns()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get campaigns
     *
     * @returns {Promise<any>}
     */
    getCampaigns(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/campaigns/campaignList', data)
            .subscribe((response: any) => {
                if (response.isSuccess)
                {
                   // this.campaigns = response.campaigns;
                    resolve(response);
                }
                else{
                    reject(response);
                }
            }, reject);
        });
    }
    updateStatusCampaigns(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/campaigns/updatestatus', data)
            .subscribe((response: any) => {
                if (response.isSuccess)
                {
                    resolve(response);
                }
                else{
                    reject(response);
                }
            }, reject);
        });
    }
}
