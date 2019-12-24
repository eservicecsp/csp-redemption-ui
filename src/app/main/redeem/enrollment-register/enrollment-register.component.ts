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
    selector     : 'enrollment-register',
    templateUrl  : './enrollment-register.component.html',
    styleUrls    : ['./enrollment-register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class EnrollmentRegisterComponent implements OnInit
{
    enrollmentRegisterForm: FormGroup;

    token: string;
    campaignId: number;
    code: string;
    consumerId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    phone: string;

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
        this.code = this._route.snapshot.queryParams['code'];
        this.consumerId = this._route.snapshot.queryParams['consumerId'];
        this.FirstName = this._route.snapshot.queryParams['firstName'];
        this.LastName = this._route.snapshot.queryParams['lastName'];
        this.Email = this._route.snapshot.queryParams['email'];
        this.phone = this._route.snapshot.queryParams['phone'];
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

        
        this.enrollmentRegisterForm = this._formBuilder.group({
            id: this.consumerId,
            code: this.code,
            firstName: [this.FirstName, Validators.required],
            lastName: [this.LastName, Validators.required],
            email: [this.Email, [Validators.required, Validators.email]],
            birthDate: ['', Validators.required],
            phone   : [this.phone, Validators.required],
            address1   : [undefined, Validators.required],
            address2   : [undefined ],
            tumbolCode: [undefined, Validators.required],
            amphurCode: [undefined, Validators.required],
            provinceCode: [undefined, Validators.required],
            zipCode: [undefined, Validators.required],
            campaignId: [this.campaignId],
            token: [this.token],
            isSkincare: false,
            isMakeup: false,
            isBodycare: false,
            isSupplements: false,
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
            this.enrollmentRegisterForm.controls['zipCode'].patchValue( tumbol.zipCode);
        }
    }

    register(): void
    {
        const requestData = {
            code: this.code,
            firstName: this.enrollmentRegisterForm.value.firstName,
            lastName: this.enrollmentRegisterForm.value.lastName,
            email: this.enrollmentRegisterForm.value.email,
            birthDate: moment(this.enrollmentRegisterForm.value.birthDate).format('YYYY-MM-DD'),
            phone   : this.phone,
            address1   : this.enrollmentRegisterForm.value.address1,
            address2   : null,
            tumbolCode: this.enrollmentRegisterForm.value.tumbolCode,
            amphurCode: this.enrollmentRegisterForm.value.amphurCode,
            provinceCode: this.enrollmentRegisterForm.value.provinceCode,
            zipCode: this.enrollmentRegisterForm.value.zipCode,
            campaignId: this.campaignId,
            token: this.token, 
            isSkincare: this.enrollmentRegisterForm.value.isSkincare,
            isMakeup: this.enrollmentRegisterForm.value.isMakeup,
            isBodycare: this.enrollmentRegisterForm.value.isBodycare,
            isSupplements: this.enrollmentRegisterForm.value.isSupplements,
        };
        //console.log(requestData);
        this._redeemService.register(requestData).then(response => {
            this.isRewardShow = true;
            this.message = response.message;
            
        });
    }
}
