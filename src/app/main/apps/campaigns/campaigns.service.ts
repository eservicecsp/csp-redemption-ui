import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CampaignsService
{
    public readonly baseURL: string;

    onCampaignTypeChanged: BehaviorSubject<any>;

    constructor(private _httpClient: HttpClient)
    {
        // Set the defaults
        this.onCampaignTypeChanged = new BehaviorSubject({});
    }

    createOrder(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            // this._httpClient.post(`${environment.apiBaseUrl}/api/orders/create`, data)
            //     .subscribe((response: any) => {
            //         resolve(response);
            //     }, reject);
        });
    }
}
