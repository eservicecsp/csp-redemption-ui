import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

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
    latitude: string;
    longitude: string;

    token: string;
    campaignId: number;
    campaignTypeId: number;
    collectingType: number;
    setRows: number;
    setColumns: number;
    collectingData: any[];

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

    productTypes: any[];
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

        this._redeemService.getProductTypesByCampaignId(this.campaignId).then(res => {
            if (res){
                this.productTypes = res;
            }
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
        this._redeemService.getPosition().then(position =>
            {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            }, error => {
                this.latitude = null;
                this.longitude = null;
        });

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
            birthDate:  [undefined, Validators.required],
            productType: new FormArray([]),
        });
    }
    onCheckChange(event) {
        const formArray: FormArray = this.collectingRegisterForm.get('productType') as FormArray;
      
        /* Selected */
        if(event.target.checked){
          // Add a new control in the arrayForm
          formArray.push(new FormControl(event.target.value));
        }
        /* unselected */
        else{
          // find the unselected element
          let i: number = 0;
      
          formArray.controls.forEach((ctrl: FormControl) => {
            if(ctrl.value == event.target.value) {
              // Remove the unselected element from the arrayForm
              formArray.removeAt(i);
              return;
            }
      
            i++;
          });
        }
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
            birthDate:  moment(this.collectingRegisterForm.value.birthDate).format('YYYY-MM-DD'),
            productType: this.collectingRegisterForm.get('productType').value,
            latitude: this.latitude,
            longitude: this.longitude
        };

        this._redeemService.register(requestData).then(response => {
            this.isRewardShow = true;
            this.campaignTypeId = response.campaignType;
            this.collectingType = response.collectingType;
            this.setRows = response.rows;
            this.setColumns = response.columns;
            this.collectingData = response.collectingData;

            this.isRewardShow = true;
            this.pieces = response.pieces;
            this.totalPieces = response.totalPieces;
            this.message = response.message;
            this.routerLink = 'https://etax.chanwanich.com/csp-redemption-front-ui/apps/home?phone=' + this._route.snapshot.queryParams['phone'] + '&brandId=' + response.brandId;
        });
    }
    closeResponse(): void{
        this.collectingRegisterForm.reset();
        this.isRewardShow = false;
    }
}
