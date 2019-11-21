import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

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
            this.campaigns = [
                {
                    name: 'Campaign 01', 
                },
                {
                    name: 'Campaign 02', 
                }
            ];
            resolve(this.campaigns);
            // this._httpClient.get('api/campaigns')
            //     .subscribe((response: any) => {
            //         this.campaigns = response;
            //         resolve(response);
            //     }, reject);
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
