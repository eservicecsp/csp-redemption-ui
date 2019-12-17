import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RedeemService } from '../redeem.service';

@Component({
    selector     : 'collecting',
    templateUrl  : './collecting.component.html',
    styleUrls    : ['./collecting.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CollectingComponent implements OnInit
{
    collectingForm: FormGroup;

    token: string;
    campaignId: string;

    isRewardShow: boolean;
    isShowReward01: boolean;
    isShowReward02: boolean;
    isShowReward03: boolean;
    isShowReward04: boolean;
    isShowReward05: boolean;
    pieces = [];
    totalPieces = 0;
    msgWinner = '';
    isWinner: boolean;
    message: string;


    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _redeemService: RedeemService,
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // get return url from route parameters or default to '/'
        this.token = this._route.snapshot.queryParams['token'];
        this.campaignId = this._route.snapshot.queryParams['campaignId'];

        this.isShowReward01 = false;
        this.isShowReward02 = false;
        this.isShowReward03 = false;
        this.isShowReward04 = false;
        this.isShowReward05 = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.collectingForm = this._formBuilder.group({
            phone   : ['', [Validators.required]]
        });

        console.log(this.token);
        console.log(this.campaignId);
    }

    collecting(): void
    {
        // this.isRewardShow = true;
        // this.pieces = [1, 2, 4, 5];
        // this.totalPieces = 5;
        // if (this.totalPieces === this.pieces.length){
        //     this.isWinner = true;
        //     this.msgWinner = 'ยินดีด้วย! คุณสะสมชิ้นส่วนครบแล้ว';
        // }else{
        //     this.msgWinner = 'พยายามอีกนิด ชิ้นส่วนยังไม่ครบ';
        // }


        const requestData = {
            phone  : this.collectingForm.value.phone,
            token   : this.token,
            campaignId: this.campaignId,
        };

        this._redeemService.isExist(requestData).then(response => {
            if (response.isExist)
            {
                this.isRewardShow = true;
                this.pieces = response.pieces;
                this.totalPieces = response.totalPieces;
                if (this.totalPieces === this.pieces.length){
                    this.isWinner = true;
                    this.msgWinner = 'ยินดีด้วย! คุณสะสมชิ้นส่วนครบแล้ว';
                }else{
                    this.msgWinner = 'พยายามอีกนิด ชิ้นส่วนยังไม่ครบ';
                    this.message = response.message;
                }

                // this.isShowReward01 = true;
            }
            else
            {
                // this._router.navigate(['redeem/collecting/register', {token: this.token, campaignId: this.campaignId}]);
                if(response.statusTypeCode === 'DUPLICATE'){
                    console.log('DUPLICATE');
                }
                else if(response.statusTypeCode === 'SUCCESS'){
                    console.log('SUCCESS');
                    console.log(response);
                }
                else if(response.statusTypeCode === 'FAIL'){
                    console.log('FAIL');
                }
                else{
                    this._router.navigate(['redeem/collecting/register'], {queryParams: {token: this.token, campaignId: this.campaignId, phone: this.collectingForm.value.phone}});
                }
                
            }
        });
    }
}
