import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { RedeemService } from '../redeem.service';
import { switchMap, zip } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
            firstName: [undefined, [Validators.required]],
            lastName: [undefined, [Validators.required]],
            email: [undefined, [Validators.required]],
            phone   : [undefined, [Validators.required]],
            address1   : [undefined, [Validators.required]],
            address2   : [undefined],
            tumbolCode: [undefined, [Validators.required]],
            amphurCode: [undefined, [Validators.required]],
            provinceCode: [undefined, [Validators.required]],
            zipCode: [undefined, [Validators.required]],
            campaignId: [this.campaignId, [Validators.required]],
            token: [this.token],
            birthDate: ['2019-11-27']
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
            this.pointRegisterForm.controls['zipCode'].patchValue( tumbol.zipCode);
        }
    }

    register(): void
    {
        const requestData = this.pointRegisterForm.value;

        // console.log(requestData);

        this._redeemService.register(requestData).then(response => {
            console.log(response);
        });
    }
}
