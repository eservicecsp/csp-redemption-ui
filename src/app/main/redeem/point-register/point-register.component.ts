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
    selector     : 'point-register',
    templateUrl  : './point-register.component.html',
    styleUrls    : ['./point-register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PointRegisterComponent implements OnInit
{
    pointRegisterForm: FormGroup;

    token: string;
    campaignId: number;

    provinces: any[];
    amphurs: any[];
    tumbols: any[];

    isRewardShow: boolean;
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.pointRegisterForm = this._formBuilder.group({
            id: [0],
            firstName: [undefined, Validators.required],
            lastName: [undefined, Validators.required],
            email: [undefined, [Validators.required, Validators.email]],
            phone   : [this._route.snapshot.queryParams['phone'], Validators.required],
            address1   : [undefined, Validators.required],
            address2   : [undefined],
            tumbolCode: [undefined, Validators.required],
            amphurCode: [undefined, Validators.required],
            provinceCode: [undefined, Validators.required],
            zipCode: [undefined, Validators.required],
            campaignId: [this.campaignId, Validators.required],
            token: [this.token],
            birthDate:  ['', Validators.required]
        });
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
            this.pointRegisterForm.controls['zipCode'].patchValue( tumbol.zipCode);
        }
    }

    register(): void
    {
        const requestData = {
            firstName: this.pointRegisterForm.value.firstName,
            lastName: this.pointRegisterForm.value.lastName,
            email: this.pointRegisterForm.value.email,
            phone   : this._route.snapshot.queryParams['phone'],
            address1   : this.pointRegisterForm.value.address1,
            address2   : null,
            tumbolCode: this.pointRegisterForm.value.tumbolCode,
            amphurCode: this.pointRegisterForm.value.amphurCode,
            provinceCode: this.pointRegisterForm.value.provinceCode,
            zipCode: this.pointRegisterForm.value.zipCode,
            campaignId: this.campaignId,
            token: this.token,
            birthDate:  moment(this.pointRegisterForm.value.birthDate).format('YYYY-MM-DD')
        };
        

        //console.log(requestData);
        this._redeemService.register(requestData).then(response => {
            this.isRewardShow = true;
            this.message = response.message;
        });
    }
}