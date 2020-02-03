import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { CreateCampaignsService } from '../create-campaigns/create-campaigns.service';

@Component({
    selector   : 'campaign-create',
    templateUrl: './campaign-create.component.html',
    styleUrls  : ['./campaign-create.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CampaignCreateComponent implements OnInit, OnDestroy
{
    campaignTypes: any[];

    

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _router: Router,
        private _createCampaignsService: CreateCampaignsService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.campaignTypes = this._createCampaignsService.campaignTypes;
    }

    ngOnInit(): void 
    {
        
    }

    ngOnDestroy(): void 
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createCampaign(campaignType: number): void
    {
        this._createCampaignsService.onCampaignTypeChanged.next(campaignType);
        this._router.navigate(['/apps/campaign-create/form']);
    }
}
