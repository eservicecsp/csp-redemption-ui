import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { RedeemService } from '../redeem.service';
import { switchMap, zip } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector     : 'collecting-register',
    templateUrl  : './collecting-register.component.html',
    styleUrls    : ['./collecting-register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CollectingRegisterComponent implements OnInit
{
    collectingRegisterForm: FormGroup;

    token: string;
    campaignId: number;

    provinces: any[];
    amphurs: any[];
    tumbols: any[];

    isRewardShow: boolean;
    message: string;
    isShowReward01: boolean;
    isShowReward02: boolean;
    isShowReward03: boolean;
    isShowReward04: boolean;
    isShowReward05: boolean;

    pieces = [];
    totalPieces = 0;
    msgWinner = '';
    isWinner: boolean;

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
        this.isRewardShow = false;
        this.message = undefined;
        this._redeemService.getProvinces().then(response => {
            this.provinces = response.provinces;
        });
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
        this.collectingRegisterForm = this._formBuilder.group({
            id: [0],
            firstName: [undefined, Validators.required],
            lastName: [undefined, Validators.required],
            email: [undefined, [Validators.required, Validators.email]],
            phone   : [this._route.snapshot.queryParams['phone'], [Validators.required]],
            address1   : [undefined, Validators.required],
            address2   : [undefined],
            tumbolCode: [undefined, Validators.required],
            amphurCode: [undefined, Validators.required],
            provinceCode: [undefined, Validators.required],
            zipCode: [undefined, Validators.required],
            campaignId: [this.campaignId, Validators.required],
            token: [this.token],
            birthDate:  [undefined, Validators.required]
        });

        console.log(this.token);
        console.log(this.campaignId);
    }

    getAmphurs(event): void
    {
        const provinceCode = event.value;
        this._redeemService.getAmphurs(provinceCode).then(response => {
            this.amphurs = response.amphurs;
        });
    }

    getTumbols(event): void
    {
        const amphurCode = event.value;
        this._redeemService.getTumbols(amphurCode).then(response => {
            this.tumbols = response.tumbols;
        });
    }

    getZipcode(event): void
    {
        const tumbolCode = event.value;
        const tumbol = this.tumbols.find(x=>x.code === tumbolCode);
        if (tumbol.zipCode)
        {
            this.collectingRegisterForm.controls['zipCode'].patchValue( tumbol.zipCode);
        }
    }

    register(): void
    {
        const requestData = {
            firstName: this.collectingRegisterForm.value.firstName,
            lastName: this.collectingRegisterForm.value.lastName,
            email: this.collectingRegisterForm.value.email,
            phone   : this._route.snapshot.queryParams['phone'],
            address1   : this.collectingRegisterForm.value.address1,
            address2   : null,
            tumbolCode: this.collectingRegisterForm.value.tumbolCode,
            amphurCode: this.collectingRegisterForm.value.amphurCode,
            provinceCode: this.collectingRegisterForm.value.provinceCode,
            zipCode: this.collectingRegisterForm.value.zipCode,
            campaignId: this.campaignId,
            token: this.token,
            birthDate:  moment(this.collectingRegisterForm.value.birthDate).format('YYYY-MM-DD')
        };

        this._redeemService.register(requestData).then(response => {
            this.isRewardShow = true;
            // response.pieces.forEach(x => {
            //     switch(x){
            //         case 1: this.isShowReward01 = true; break;
            //         case 2: this.isShowReward02 = true; break;
            //         case 3: this.isShowReward03 = true; break;
            //         case 4: this.isShowReward04 = true; break;
            //         case 5: this.isShowReward05 = true; break;
            //     }
            // })
            this.pieces = response.pieces;
            this.totalPieces = response.totalPieces;
            if (this.totalPieces === this.pieces.length){
                this.isWinner = true;
                this.msgWinner = 'ยินดีด้วย! คุณสะสมชิ้นส่วนครบแล้ว';
            }else{
                this.msgWinner = 'พยายามอีกนิด ชิ้นส่วนยังไม่ครบ';
                this.message = response.message;
            }
        });
    }
}
