import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import * as moment from 'moment';

import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { CampaignsService } from '../campaigns.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector   : 'create-campaign',
    templateUrl: './create-campaign.component.html',
    styleUrls  : ['./create-campaign.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CreateCampaignComponent implements OnInit, OnDestroy
{
    // Private
    private _unsubscribeAll: Subject<any>;
    
    campaignType: any;
    campaignName: string;

    form: FormGroup;
    collectingForm: FormGroup;
    PointForm: FormGroup;
    urlValue: string;
    url: string;
    currentDate = new Date();

    

    userId: number;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private _formBuilder: FormBuilder,
        private _campaignsService: CampaignsService,
        private _authenticationService: AuthenticationService,
        private _datepipe: DatePipe,
        private _snackBar: MatSnackBar,
        private _router: Router,
        )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.userId = this._authenticationService.getRawAccessToken('userId');
         // Reactive Form
        this.form = this._formBuilder.group({
            Id:  [''],
            //url : [''],
            name : ['', Validators.required],
            description : [undefined],
            quantity : ['', Validators.required],
            startDate : ['', Validators.required],
            endDate : ['', Validators.required],
            alertMessage : ['', Validators.required],
            duplicateMessage : ['', Validators.required],
            qrCodeNotExistMessage : ['', Validators.required],
            winMessage : ['', Validators.required],
            createdBy: [this.userId]
        });       
        
        this.collectingForm = this._formBuilder.group({
            Id:  [''],
            name : [undefined, Validators.required],
            description : [undefined],
           // url : [''],
            //quantity : [0, Validators.required],
            startDate : [undefined, Validators.required],
            endDate : [undefined, Validators.required],
            createdBy: [0],
            alertMessage : [undefined, Validators.required],
            duplicateMessage : [undefined, Validators.required],
            qrCodeNotExistMessage : [undefined, Validators.required],
            winMessage : [undefined, Validators.required],
            peices: this._formBuilder.array([])
        });

        this.PointForm = this._formBuilder.group({
            Id:  [''],
            //url : [''],
            name : ['', Validators.required],
            description : [undefined],
            quantity : ['', Validators.required],
            startDate : ['', Validators.required],
            endDate : ['', Validators.required],
            alertMessage : ['', Validators.required],
            duplicateMessage : ['', Validators.required],
            qrCodeNotExistMessage : ['', Validators.required],
            winMessage : ['', Validators.required],
            createdBy: [this.userId],
            point: ['', Validators.required]
        });
    }

    ngOnInit(): void 
    {
        //const campaignId = this._datepipe.transform(new Date(), 'yyyyMMddHHmmssSSS');
        const campaignId = 'token=[#token#]&campaignId=[#campaignId#]';

        this.urlValue = undefined;

        const port = window.location.port;

        this._campaignsService.onCampaignTypeChanged.subscribe(campaignType => {
            this.campaignType = campaignType;
            this.campaignName = campaignType.title;
            let campaignTypeName = 'collecting';
            if (this.campaignType.id === 3){
                campaignTypeName = 'enrollment';
            }else if (this.campaignType.id === 2){
                campaignTypeName = 'point';
            }

           


            switch (this.campaignType.id){
                case 1: {
                    // Collecting
                    //this.collectingForm.controls['Url'].setValue(url);
                    if (port && port !== '0'){
                        this.url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/csp-redemption-ui/redeem/collecting?' + campaignId;
                    }
                    else
                    {
                        this.url = window.location.protocol + '//' + window.location.hostname + '/csp-redemption-ui/redeem/collecting?' + campaignId;
                    }

                    this.collectingForm.reset({
                        createdBy: this.userId
                    });
                    this.addPeice();
                    break;
                }
                case 2: {
                    // Point & Reward
                    if (port && port !== '0'){
                        this.url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/csp-redemption-ui/redeem/point?' + campaignId;
                    }
                    else
                    {
                        this.url = window.location.protocol + '//' + window.location.hostname + '/csp-redemption-ui/redeem/point?' + campaignId;
                    }
                    this.form.reset({
                        createdBy: this.userId
                    });
                    break;
                }
                case 3: {
                    // Enrollment & Member
                    //this.form.controls['Url'].setValue(url);
                    if (port && port !== '0'){
                        this.url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/csp-redemption-ui/redeem/enrollment?' + campaignId;
                    }
                    else
                    {
                        this.url = window.location.protocol + '//' + window.location.hostname + '/csp-redemption-ui/redeem/enrollment?' + campaignId;
                    }
                    this.form.reset({
                        createdBy: this.userId
                    });
                    break;
                }
                default: {
                    this._router.navigate(['apps/campaigns']);
                }
            }

           
        });
    }

    get peices(): FormArray {
        return this.collectingForm.get('peices') as FormArray;
    }

    addPeice(): void
    {
        const noFC = this._formBuilder.control(0);
        const quantityFC = this._formBuilder.control(0);

        this.peices.push(
            this._formBuilder.group({
                no: noFC,
                quantity: quantityFC,
            })
        );
    }

    deletePeice(index: number): void
    {
        this.peices.removeAt(index);
    }

    ngOnDestroy(): void 
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    generateQrCode(): void 
    {
        //console.log(this.form.value);
        this.urlValue = this.form.value.url;
    }
    createCampaign(): void
    {
        //console.log(this._datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd'));
        let data = {};
        let camp = {};
        if (this.campaignType.id === 3){ // Enrollment & Member
            data = {
                Name: this.form.value.name,
                Description: this.form.value.description,
                CampaignTypeId: this.campaignType.id,
                Url: this.url,
                Quantity: this.form.value.quantity,
                TotalPeice: null,
                StartDate:  moment(this.form.value.startDate).format('YYYY-MM-DD'),
                EndDate:  moment(this.form.value.endDate).format('YYYY-MM-DD'),
                AlertMessage: this.form.value.alertMessage,
                DuplicateMessage: this.form.value.duplicateMessage,
                QrCodeNotExistMessage: this.form.value.qrCodeNotExistMessage,
                WinMessage: this.form.value.winMessage,
                CreatedBy: this.userId,
           };
            camp = {
                Peices : [],
                Point: 0,
                Campaign: data
            };
        }
        if (this.campaignType.id === 2){ // Point & Reward
            data = {
                Name: this.PointForm.value.name,
                Description: this.PointForm.value.description,
                CampaignTypeId: this.campaignType.id,
                Url: this.url,
                Quantity: this.PointForm.value.quantity,
                StartDate:  moment(this.PointForm.value.startDate).format('YYYY-MM-DD'),
                EndDate:  moment(this.PointForm.value.endDate).format('YYYY-MM-DD'),
                AlertMessage: this.PointForm.value.alertMessage,
                DuplicateMessage: this.PointForm.value.duplicateMessage,
                QrCodeNotExistMessage: this.PointForm.value.qrCodeNotExistMessage,
                WinMessage: this.PointForm.value.winMessage,
                CreatedBy: this.userId,
           };
            camp = {
                Peices : [],
                Point: this.PointForm.value.point,
                Campaign: data
            };
        }
        if (this.campaignType.id === 1){ // Collecting
            let Quantity = 0;
            const arrayPeices = [];
            this.peices.controls.forEach(element => {
              arrayPeices.push(element.value.quantity);
              Quantity =  Quantity + Number(element.value.quantity);
              
           });
            data = {
                Name: this.collectingForm.value.name,
                Description: this.collectingForm.value.description,
                CampaignTypeId: this.campaignType.id,
                Url: this.url,
                Quantity: Quantity,
                TotalPeice : this.peices.controls.length, 
                StartDate:  moment(this.collectingForm.value.startDate).format('YYYY-MM-DD'),
                EndDate:  moment(this.collectingForm.value.endDate).format('YYYY-MM-DD'),
                AlertMessage: this.collectingForm.value.alertMessage,
                DuplicateMessage: this.collectingForm.value.duplicateMessage,
                QrCodeNotExistMessage: this.collectingForm.value.qrCodeNotExistMessage,
                WinMessage: this.collectingForm.value.winMessage,
                CreatedBy: this.userId,
           };
            
            camp = {
               Peices : arrayPeices,
               Point: 0,
               Campaign: data
           };
        }
        this._campaignsService.createOrder(camp).then(response => {
            if (response.isSuccess === false){
                this._snackBar.open(response.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['error-snackbar']
                });
            }else{
                this._snackBar.open('Send data successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
                this._router.navigate(['/apps/monitoring/campaign']);
            }
        });
    }
}
