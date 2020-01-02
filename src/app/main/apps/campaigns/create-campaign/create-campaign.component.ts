import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import * as moment from 'moment';

import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { CampaignsService } from '../campaigns.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Router } from '@angular/router';
import { ConfigurationsProductsService } from 'app/main/configurations/products/products.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';

@Component({
    selector   : 'create-campaign',
    templateUrl: './create-campaign.component.html',
    styleUrls  : ['./create-campaign.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class CreateCampaignComponent implements OnInit, OnDestroy
{
    // Private
    private _unsubscribeAll: Subject<any>;
    
    campaignType: any;
    campaignName: string;
    products: any[];

    form: FormGroup;
    collectingForm: FormGroup;
    PointForm: FormGroup;
    urlValue: string;
    url: string;
    currentDate = new Date();

    

    userId: number;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    columnQuantity = [];
    rowQuantity = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _campaignsService: CampaignsService,
        private _authenticationService: AuthenticationService,
        private _configurationsProductsService: ConfigurationsProductsService,
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
            waste:  ['', Validators.required],
            name : ['', Validators.required],
            description : [undefined],
            product: ['', Validators.required],
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
            waste:  ['', Validators.required],
            description : [undefined],
            product: ['', Validators.required],
            collectingType: [undefined],
            rows: [{value: 0}, [Validators.required]],
            columns: [{value: 0}, [Validators.required]],
            rowColumns: this._formBuilder.array([]),
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
            name : ['', Validators.required],
            waste:  ['', Validators.required],
            description : [undefined],
            product: ['', Validators.required],
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

        this.collectingForm.controls['rows'].valueChanges.subscribe(response => {
            this.rowQuantity = [];
            const rows = this.collectingForm.controls['rows'].value;
            for (let index = 1; index <= rows; index++) {
                this.rowQuantity.push(index);
            }

            this.refreshRowColumnTable();
        });

        this.collectingForm.controls['columns'].valueChanges.subscribe(response => {
            this.columnQuantity = [];
            const columns = this.collectingForm.controls['columns'].value;
            for (let index = 1; index <= columns; index++) {
                this.columnQuantity.push(index);
            }

            this.refreshRowColumnTable();
        });
    }

    ngOnInit(): void 
    {
        this._configurationsProductsService.getProducts().then(res => {
            if (res.isSuccess){
                this.products = res.products;
            }
        });
        // const campaignId = this._datepipe.transform(new Date(), 'yyyyMMddHHmmssSSS');
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
        
        this.urlValue = this.form.value.url;
    }

    createCampaign(): void
    {
        let data = {};
        let camp = {};
        if (this.campaignType.id === 3){ // Enrollment & Member
            data = {
                Name: this.form.value.name,
                Waste: this.form.value.waste,
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
                Campaign: data,
                Product: this.form.value.product,
            };
        }
        if (this.campaignType.id === 2){ // Point & Reward
            data = {
                Name: this.PointForm.value.name,
                Waste: this.PointForm.value.waste,
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
                Campaign: data,
                Product: this.PointForm.value.product
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
                Waste: this.collectingForm.value.waste,
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
               Campaign: data,
               Product: this.collectingForm.value.product
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

    refreshRowColumnTable(): void
    {
        const controls = this.collectingForm.controls['rowColumns'] as FormArray;
        controls.clear();

        this.rowQuantity.forEach(row => {
            const rowFC = this._formBuilder.control(row);
            this.columnQuantity.forEach(column => {
                const columnFC = this._formBuilder.control(column);

                const attachmentIdFC = this._formBuilder.control(0);
                const attachmentNameFC = this._formBuilder.control(undefined);
                const attachmentPathFC = this._formBuilder.control(undefined);
                const attachmentFileFC = this._formBuilder.control(undefined);
                const attachmentExtensionFC = this._formBuilder.control(undefined);

                const fileFC = this._formBuilder.group({
                    id: attachmentIdFC,
                    name: attachmentNameFC,
                    path: attachmentPathFC,
                    file: attachmentFileFC,
                    extension: attachmentExtensionFC
                });
                controls.push(
                    this._formBuilder.group({
                        row: rowFC,
                        column: columnFC,
                        file: fileFC,
                    })
                ) ;
            });
        });
        console.log(this.collectingForm.value);
    }

    collectingTypeRadioChange(event): void {
        if (event.value === '1'){
            this.collectingForm.patchValue({
                rows: 1,
            });
        }
    }
}
