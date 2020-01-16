import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { CreateCampaignsService } from './create-campaigns.service';

@Component({
    selector   : 'create-campaigns',
    templateUrl: './create-campaigns.component.html',
    styleUrls  : ['./create-campaigns.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CreateCampaignsComponent implements OnInit, OnDestroy
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
        this._router.navigate(['/apps/create-campaign/detail']);
    }
}
