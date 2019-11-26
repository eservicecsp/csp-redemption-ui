import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { CampaignsService } from './campaigns.service';

@Component({
    selector   : 'campaigns',
    templateUrl: './campaigns.component.html',
    styleUrls  : ['./campaigns.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CampaignsComponent implements OnInit, OnDestroy
{
    campaignTypes: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _router: Router,
        private _campaignsService: CampaignsService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.campaignTypes = this._campaignsService.campaignTypes;
    }

    ngOnInit(): void 
    {
        console.log(this.campaignTypes);
    }

    ngOnDestroy(): void 
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createCampaign(campaignType: number): void
    {
        this._campaignsService.onCampaignTypeChanged.next(campaignType);
        this._router.navigate(['/apps/campaigns/create']);
    }
}
