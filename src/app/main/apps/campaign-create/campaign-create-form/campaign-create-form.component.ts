import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import * as moment from 'moment';

import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, NgModel } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Router } from '@angular/router';
import { ConfigurationsProductsService } from 'app/main/configurations/products/products.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';
import { ConfigurationsDealersService } from 'app/main/configurations/dealers/dealers.service';
import { ConfigurationsContactUsService } from 'app/main/configurations/contact-us/contact-us.service';
import { CreateCampaignsService } from '../../create-campaigns/create-campaigns.service';

@Component({
    selector   : 'campaign-create-form',
    templateUrl: './campaign-create-form.component.html',
    styleUrls  : ['./campaign-create-form.component.scss'],
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
export class CampaignDetailFromComponent implements OnInit, OnDestroy
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

    dealerList: [];

    columnQuantity = [];
    rowQuantity = [];

    toppings = new FormControl();

    constructor(
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private _createCampaignsService: CreateCampaignsService,
        private _configurationsProductsService: ConfigurationsProductsService,
        private _configurationsDealersService: ConfigurationsDealersService,
        private _datepipe: DatePipe,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _configurationsContactUsService: ConfigurationsContactUsService,
        )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.userId = this._authenticationService.getRawAccessToken('userId');

        this._configurationsDealersService.getDealers().then(response => {
            if (response.isSuccess) {
                this.dealerList = response.dealers;
            }
        });
        
       
         // Reactive Form
        this.form = this._formBuilder.group({
            waste:  ['', Validators.required],
            id:  0,
            name : ['', Validators.required],
            description : [undefined],
            product: ['', Validators.required],
            dealers: [undefined],
            quantity : ['', Validators.required],
            startDate : ['', Validators.required],
            endDate : ['', Validators.required],
            alertMessage : ['', Validators.required],
            duplicateMessage : ['', Validators.required],
            qrCodeNotExistMessage : ['', Validators.required],
            winMessage : ['', Validators.required],
            createdBy: [this.userId],
            CampaignTypeId : 0,
            tel: [''],
            facebook : [''],
            line: [''],
            web : [''],
        });       
        
        this.collectingForm = this._formBuilder.group({
            id:  0,
            name : [undefined, Validators.required],
            waste:  ['', Validators.required],
            description : [undefined],
            product: ['', Validators.required],
            collectingType: [undefined],
            rows: [{value: 0}, [Validators.required]],
            dealers: [undefined],
            columns: [{value: 0}, [Validators.required, Validators.max(3)]],
            // rowColumnData: this._formBuilder.array([]),
            collectingData: this._formBuilder.array([]),
            startDate : [undefined, Validators.required],
            endDate : [undefined, Validators.required],
            createdBy: [0],
            alertMessage : [undefined, Validators.required],
            duplicateMessage : [undefined, Validators.required],
            qrCodeNotExistMessage : [undefined, Validators.required],
            winMessage : [undefined, Validators.required],
            campaignTypeId : 0,
            url: [undefined],
            tel: [''],
            facebook : [''],
            line: [''],
            web : [''],
        });

        this.PointForm = this._formBuilder.group({
            id:  0,
            name : ['', Validators.required],
            waste:  ['', Validators.required],
            description : [undefined],
            product: ['', Validators.required],
            dealers: [undefined],
            quantity : ['', Validators.required],
            startDate : ['', Validators.required],
            endDate : ['', Validators.required],
            alertMessage : ['', Validators.required],
            duplicateMessage : ['', Validators.required],
            qrCodeNotExistMessage : ['', Validators.required],
            winMessage : ['', Validators.required],
            createdBy: [this.userId],
            point: ['', Validators.required],
            CampaignTypeId : 0,
            tel: [''],
            facebook : [''],
            line: [''],
            web : [''],
        });

        this.collectingForm.controls['rows'].valueChanges.subscribe(rows => {
            if (this.collectingForm.controls['collectingType'].value === '1'){
                this.refreshRowColumnTable();
            } else {
                this.rowQuantity = [];
                for (let row = 1; row <= rows; row++) {
                    this.rowQuantity.push(row);
                }
            }
        });

        this.collectingForm.controls['columns'].valueChanges.subscribe(columns => {
            if (this.collectingForm.controls['collectingType'].value === '1'){

            } else {
                this.columnQuantity = [];
                for (let column = 1; column <= columns; column++) {
                    this.columnQuantity.push(column);
                }
            }
        });
    }

    ngOnInit(): void 
    {
        
        this._configurationsContactUsService.getContactUs().then(response => {
            if (response.isSuccess){
                if (response.contactUs != null){
                    this.form.controls['tel'].setValue(response.contactUs.tel);
                    this.form.controls['facebook'].setValue(response.contactUs.facebook);
                    this.form.controls['line'].setValue(response.contactUs.line);
                    this.form.controls['web'].setValue(response.contactUs.web);

                    this.collectingForm.controls['tel'].setValue(response.contactUs.tel);
                    this.collectingForm.controls['facebook'].setValue(response.contactUs.facebook);
                    this.collectingForm.controls['line'].setValue(response.contactUs.line);
                    this.collectingForm.controls['web'].setValue(response.contactUs.web);

                    this.PointForm.controls['tel'].setValue(response.contactUs.tel);
                    this.PointForm.controls['facebook'].setValue(response.contactUs.facebook);
                    this.PointForm.controls['line'].setValue(response.contactUs.line);
                    this.PointForm.controls['web'].setValue(response.contactUs.web);
                }
            }
        });
        this._configurationsProductsService.getProducts().then(res => {
            if (res.isSuccess){
                this.products = res.products;
            }
        });
        // const campaignId = this._datepipe.transform(new Date(), 'yyyyMMddHHmmssSSS');
        const campaignId = 'token=[#token#]&campaignId=[#campaignId#]';

        this.urlValue = undefined;

        const port = window.location.port;

        this._createCampaignsService.onCampaignTypeChanged.subscribe(campaignType => {
            this.campaignType = campaignType;
            this.campaignName = campaignType.title;
            let campaignTypeName = 'collecting';
            if (this.campaignType.id === 3){
                campaignTypeName = 'enrollment';
            } else if (this.campaignType.id === 2){
                campaignTypeName = 'point';
            }

            switch (this.campaignType.id){
                case 1: {
                    // Collecting
                    // this.collectingForm.controls['Url'].setValue(url);
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
                    // this.addPeice();
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
                    // this.form.controls['Url'].setValue(url);
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
        let campaign = {};
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
                dealers: this.form.value.dealers.length === 0 ? this.dealerList : this.form.value.dealers,
                tel: this.form.value.tel,
                facebook: this.form.value.facebook,
                line: this.form.value.line,
                web: this.form.value.web,
            };
            console.log(this.form.value.dealers);
            //this.form.controls['campaignTypeId'].setValue(this.campaignType.id);
            campaign = {
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
                dealers: this.PointForm.value.dealers.length === 0 ? this.dealerList : this.PointForm.value.dealers,
                tel: this.PointForm.value.tel,
                facebook: this.PointForm.value.facebook,
                line: this.PointForm.value.line,
                web: this.PointForm.value.web,
            };
            console.log(this.PointForm.value.dealers);
            //this.PointForm.controls['campaignTypeId'].setValue(this.campaignType.id);
            campaign = {
                Peices : [],
                Point: this.PointForm.value.point,
                Campaign: data,
                Product: this.PointForm.value.product
            };
        }
        if (this.campaignType.id === 1){ // Collecting
            // let Quantity = 0;
            // const arrayPeices = [];
            // this.peices.controls.forEach(element => {
            // arrayPeices.push(element.value.quantity);
            // Quantity =  Quantity + Number(element.value.quantity);
            
            // });
            data = {
                Name: this.collectingForm.value.name,
                Waste: this.collectingForm.value.waste,
                Description: this.collectingForm.value.description,
                CampaignTypeId: this.campaignType.id,
                Url: this.url,
                // TotalPeice : this.peices.controls.length, 
                StartDate:  moment(this.collectingForm.value.startDate).format('YYYY-MM-DD'),
                EndDate:  moment(this.collectingForm.value.endDate).format('YYYY-MM-DD'),
                AlertMessage: this.collectingForm.value.alertMessage,
                DuplicateMessage: this.collectingForm.value.duplicateMessage,
                QrCodeNotExistMessage: this.collectingForm.value.qrCodeNotExistMessage,
                WinMessage: this.collectingForm.value.winMessage,
                CreatedBy: this.userId,
           };
            this.collectingForm.controls['campaignTypeId'].setValue(this.campaignType.id);
            this.collectingForm.controls['url'].setValue(this.url);
            campaign = {
                //    Peices : arrayPeices,
                Point: 0,
                Campaign: this.collectingForm.value,
                Product: this.collectingForm.value.product,
                
            };
        }
        //console.log(campaign)
        this._createCampaignsService.createOrder(campaign).then(response => {
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
                this._router.navigate(['/apps/campaigns']);
            }
        });
    }

    refreshRowColumnTable(): void
    {
        const controls = this.collectingForm.controls['collectingData'] as FormArray;
        controls.clear();
        const rows = this.collectingForm.controls['rows'].value;
        for (let i = 1; i <= rows ; i++) {
            const rowFC = this._formBuilder.control(i);
            const columnFC = this._formBuilder.control(1);

            const attachmentIdFC = this._formBuilder.control(0);
            const attachmentNameFC = this._formBuilder.control(undefined);
            const attachmentPathFC = this._formBuilder.control(undefined);
            const attachmentFileFC = this._formBuilder.control(undefined);
            const attachmentExtensionFC = this._formBuilder.control(undefined);

            const quantityFC = this._formBuilder.control(0);
            controls.push(
                this._formBuilder.group({
                    row: rowFC,
                    column: columnFC,
                    quantity: quantityFC,
                    id: attachmentIdFC,
                    name: attachmentNameFC,
                    path: attachmentPathFC,
                    file: attachmentFileFC,
                    extension: attachmentExtensionFC
                })
            ) ;
        }
    }

    collectingTypeRadioChange(event): void {
        this.collectingForm.controls['collectingType'].setValue(event.value);
        let row = 2;
        let column = 2;
        switch (event.value){
            case '1': {
                row = 0;
                column = 1;
                
                break;
            }
            case '2': {
                row = 2;
                column = 2;

                break;
            }
            case '3': {
                row = 3;
                column = 2;

                break;
            }
        }
        const data = [];
        for (let i = 1; i < row + 1; i++) {
            for (let j = 1; j < column + 1; j++) {
                data.push({
                    row: i,
                    column: j,
                    id: undefined,
                    name: undefined,
                    path: undefined,
                    file: undefined,
                    extension: undefined
                });
            }
        }

        // Main Control
        this.collectingForm.patchValue({
            rows: row,
            columns: column
        });

        // Sub Control
        const collectingDataControls = this.collectingForm.controls['collectingData'] as FormArray;
        collectingDataControls.clear();

        data.forEach(element => {
            const subColumnFC = this._formBuilder.control(element.column);  
            const subRowFC =    this._formBuilder.control(element.row);  
            const quantityFC = this._formBuilder.control(0);
            const attachmentIdFC = this._formBuilder.control(0);
            const attachmentNameFC = this._formBuilder.control(undefined);
            const attachmentPathFC = this._formBuilder.control(undefined);
            const attachmentFileFC = this._formBuilder.control(undefined);
            const attachmentExtensionFC = this._formBuilder.control(undefined);

            collectingDataControls.push(
                this._formBuilder.group({
                    row: subRowFC,
                    column: subColumnFC,
                    quantity: quantityFC,
                    id: attachmentIdFC,
                    name: attachmentNameFC,
                    path: attachmentPathFC,
                    file: attachmentFileFC,
                    extension: attachmentExtensionFC
                })
            );
        });        
    }

    getControl(frmGrp: FormGroup, key: string): any {
        return (frmGrp.controls[key] as FormControl);
    }

    getControls(formGroup: FormGroup, fromControl: string): any{
        return (formGroup.controls[fromControl] as FormArray).controls;
    }

    onSelectFile(event, form: FormGroup): void {
        //console.log(form)
        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            const idFC = form['id'] as FormControl;
            const fileFC = form['file'] as FormArray;
            const nameFC = form['name'] as FormArray;
            if (event.target.files[0].type.includes('jpeg') || event.target.files[0].type.includes('png')){
                if (event.target.files[0].size > 1000000){
                    this._snackBar.open('File size must smaller than 1 MB', 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['blue-snackbar']
                    });
                    fileFC.setValue(null);
                    nameFC.setValue(null);
                } else {
                    for (let i = 0; i < filesAmount; i++) {
                        const reader = new FileReader();
        
                        reader.onload = (readerEvent: any) => {
                            fileFC.setValue(readerEvent.target.result);
                        };
        
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    nameFC.setValue(event.target.files[0].name);
                    idFC.setValue(0);
                }
            }
            else{
                this._snackBar.open('Accept only jpeg and png file extension.', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['blue-snackbar']
                });
                fileFC.setValue(null);
                nameFC.setValue(null);
            }
        }
    }

    clearAttachFile(form: FormGroup): void {
        const fileControl = form['file'] as FormArray;
        const nameControl = form['name'] as FormArray;
        const extensionControl = form['extension'] as FormArray;
        fileControl.setValue(undefined);
        nameControl.setValue(undefined);
        extensionControl.setValue(undefined);
    }

    // refreshRowColumnData(): void {
    //     const controls = this.collectingForm.controls['rowColumnData'] as FormArray;
    //     controls.clear();

    //     this.rowQuantity.forEach(row => {
    //         const rowFC = this._formBuilder.control(row);
    //         this.columnQuantity.forEach(column => {
    //             const columnFC = this._formBuilder.control(column);

    //             const attachmentIdFC = this._formBuilder.control(0);
    //             const attachmentNameFC = this._formBuilder.control(undefined);
    //             const attachmentPathFC = this._formBuilder.control(undefined);
    //             const attachmentFileFC = this._formBuilder.control(undefined);
    //             const attachmentExtensionFC = this._formBuilder.control(undefined);

    //             const quantityFC = this._formBuilder.control(0);
    //             controls.push(
    //                 this._formBuilder.group({
    //                     row: rowFC,
    //                     column: columnFC,
    //                     quantity: quantityFC,
    //                     id: attachmentIdFC,
    //                     name: attachmentNameFC,
    //                     path: attachmentPathFC,
    //                     file: attachmentFileFC,
    //                     extension: attachmentExtensionFC
    //                 })
    //             ) ;
    //         });
    //     });
    // }

    // get dealers(): FormArray {
    //     return this.collectingForm.get('dealers') as FormArray;
    // }

    test(): void {
        console.log(this.collectingForm.value);
    }
    selectAll(ev){
        
        if(ev._selected){
            //this.toppings.setValue(this.dealerList);
            this.collectingForm.controls['dealers'].setValue(this.dealerList);
            this.form.controls['dealers'].setValue(this.dealerList);
            this.PointForm.controls['dealers'].setValue(this.dealerList);
            ev._selected = true;
        }
        if(ev._selected == false){
            this.collectingForm.controls['dealers'].setValue([]);
            this.form.controls['dealers'].setValue([]);
            this.PointForm.controls['dealers'].setValue([]);
          //this.toppings.setValue([]);
        }
        
    }
}
