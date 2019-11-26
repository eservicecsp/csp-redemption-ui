import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class DashboardsCampaignsService implements Resolve<any>
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
                this.getCampaigns(),
                this.getWidgets()
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
    getCampaigns(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/campaigns')
            .subscribe((response: any) => {
                if (response.isSuccess)
                {
                    this.campaigns = response.campaigns;
                    // this.onDealersChanged.next(this.campaigns);
                    resolve(response);
                }
                else{
                    reject(response);
                }
            }, reject);
        });
    }

    getCampaignSummaryById(id: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/campaigns/' + id + '/summary')
            .subscribe((response: any) => {
                if (response.isSuccess)
                {
                    resolve(response.campaign);
                }
                else{
                    reject(response);
                }
            }, reject);
        });
        
    }

    /**
     * Get widgets
     */
    getWidgets(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.widgets = [{
                ranges      : {
                    DY : 'Yesterday',
                    DT : 'Today',
                    DTM: 'Tomorrow'
                },
                currentRange: 'DT',
                data        : {
                    label: 'REGISTERS',
                    count: {
                        DY : 21,
                        DT : 25,
                        DTM: 19
                    },
                    extra: {
                        label: 'Completed',
                        count: {
                            DY : 6,
                            DT : 7,
                            DTM: '-'
                        }
    
                    }
                },
                detail      : 'You can show some detailed information about this widget in here.'
            }];
            resolve(this.widgets);
        });
    }

    /**
     * Get customers
     */
    getCustomers(data: any): Promise<any>
    {
        return new  Promise((resolve, reject) => {

        });
    }
}
