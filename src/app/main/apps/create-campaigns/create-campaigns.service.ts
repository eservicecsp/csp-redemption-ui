import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CreateCampaignsService
{
    public readonly baseURL: string;

    campaignTypes: any;
    onCampaignTypesChanged: BehaviorSubject<any>;

    onCampaignTypeChanged: BehaviorSubject<any>;

    constructor(private _httpClient: HttpClient)
    {
        // Set the defaults
        this.onCampaignTypesChanged  = new BehaviorSubject({});
        
        this.onCampaignTypeChanged = new BehaviorSubject({});
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
                this.getCampaignTypes()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


    getCampaignTypes(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/campaignTypes`)
                .subscribe((response: any) => {
                    if (response.isSuccess){
                        this.campaignTypes = response.campaignTypes;
                        this.onCampaignTypesChanged.next(this.campaignTypes);
                        resolve(response);
                    }
                    else{
                        reject(response);
                    }
                }, reject);
        });
    }

    createOrder(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/Campaigns/Create`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    updateCampaign(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/campaigns/update`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
   

}
