import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class DashboardsCampaignsService implements Resolve<any>
{
    campaigns: any[];
    widgets: any[];

    onSelectedCampaignChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _router: Router
    )
    {
        // Set default
        this.onSelectedCampaignChanged = new BehaviorSubject([]);
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
                // this.getWidgets()
                // this.getCampaignDetail(route.params['id'])
                route.params['id'] !== undefined ? this.getCampaignDetail(route.params['id']) : this._router.navigate(['apps/campaigns'])
                
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
    getTransactionByCampaignId(data): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/campaigns/transaction', data)
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

    getQrCodeByCampaignId(data): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/campaigns/qrcode', data)
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

    getEnrollment(event): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/enrollments', event)
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
    getCampaignDetail(campaignId): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/campaigns/detail/${campaignId}`)
            .subscribe((response: any) => {
                this.onSelectedCampaignChanged.next(response);
                resolve(response);
            }, reject);
        });
    }

    chartTransaction(campaignId: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/charts/transaction/` + campaignId)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    chartQrCode(campaignId: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/charts/qrcode/` + campaignId)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    charProvince(campaignId: number): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiBaseUrl}/charts/province/` + campaignId)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    sendAll(data, channel, campaignId): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiBaseUrl}/enrollments/SendAll?channel=${channel}&campaignId=${campaignId}`, data)
            .subscribe((response: any) => {
                resolve(response);
            }, reject);
        });
    }
    sendSelected(data, channel, campaignId): Promise<any>
    {
        return new Promise((resolve, reject) => {
            // console.log(data)
            // resolve({isSuccess: true})
            this._httpClient.post(`${environment.apiBaseUrl}/enrollments/SendSelected?channel=${channel}&campaignId=${campaignId}`, data)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    downloadConsumer( campaignId, campaignTypeId): Observable<Blob>
    {

        const params = new HttpParams()
        .set('campaignId', campaignId)
        .set('campaignTypeId', campaignTypeId);
        return this._httpClient.get(environment.apiBaseUrl + '/campaigns/download', {responseType: 'blob', params: params});
        
    }
}
