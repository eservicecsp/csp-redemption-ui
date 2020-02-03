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
    latitude: string;
    longitude: string;

    token: string;
    campaignId: string;
    campaignTypeId: number;
    collectingType: number;
    setRows: number;
    setColumns: number;
    collectingData: any[];



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
    routerLink: string;


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
        this._redeemService.getPosition().then(position =>
            {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            }, error => {
                this.latitude = null;
                this.longitude = null;
        });
        this.collectingForm = this._formBuilder.group({
            phone   : ['', [Validators.required]]
        });
    }
    closeResponse(): void{
        this.collectingForm.reset();
        this.isRewardShow = false;
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
            latitude: this.latitude,
            longitude: this.longitude
        };

        this._redeemService.isExist(requestData).then(response => {
            if (response.isExist)
            {
                this.campaignTypeId = response.campaignType;
                this.collectingType = response.collectingType;
                this.setRows = response.rows;
                this.setColumns = response.columns;
                this.collectingData = response.collectingData;

                this.isRewardShow = true;
                this.pieces = response.pieces;
                this.totalPieces = response.totalPieces;
                this.message = response.message;
                this.routerLink = 'https://etax.chanwanich.com/csp-redemption-front-ui/apps/home?phone=' + this.collectingForm.value.phone + '&brandId=' + response.brandId;

                //this.collectingForm.value.phone
                //response.brandId


                // this.isShowReward01 = true;
            }
            else
            {
                // this._router.navigate(['redeem/collecting/register', {token: this.token, campaignId: this.campaignId}]);
                if(response.statusTypeCode === 'DUPLICATE'){
                }
                else if(response.statusTypeCode === 'SUCCESS'){
                }
                else if(response.statusTypeCode === 'FAIL'){
                }
                else{
                    this._router.navigate(['redeem/collecting/register'], {queryParams: {token: this.token, campaignId: this.campaignId, phone: this.collectingForm.value.phone}});
                }
                
            }
        });
    }
}
