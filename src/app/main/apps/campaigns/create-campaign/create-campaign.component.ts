import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

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
    urlValue: string;
    currentDate = new Date();

    collectingForm = this._formBuilder.group({
        Id: [0],
        name : [undefined, Validators.required],
        description : [undefined],
        url: [undefined, Validators.required],
        quantity : [0, Validators.required],
        startDate : [undefined, Validators.required],
        endDate : [undefined, Validators.required],
        createdBy: [0],
        peices: this._formBuilder.array([])
    });

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
    }

    ngOnInit(): void 
    {
        const campaignId = this._datepipe.transform(new Date(), 'yyyyMMddHHmmssSSS');

        this.urlValue = undefined;

        const port = window.location.port;
        let url: string;
        this.urlValue = url;
        if (port && port !== '0'){
            url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/pages/redeem/' + campaignId;
        }
        else
        {
            url = window.location.protocol + '//' + window.location.hostname + '/pages/redeem/' + campaignId;
        }
        // url = this._campaignsService.baseURL + 'pages/enrollment/' + orderId;

        // Reactive Form
        this.form = this._formBuilder.group({
            Id: campaignId,
            url : [url],
            name : ['', Validators.required],
            description : [undefined],
            quantity : ['', Validators.required],
            startDate : ['', Validators.required],
            endDate : ['', Validators.required],
            createdBy: [this.userId]
        });       
        
        this._campaignsService.onCampaignTypeChanged.subscribe(campaignType => {
            this.campaignType = campaignType;
            this.campaignName = campaignType.title;
            switch (this.campaignType.id){
                case 1: {
                    // Collecting
                    this.collectingForm.reset({
                        createdBy: this.userId
                    });
                    this.addPeice();

                    break;
                }
                case 2: {
                    // Point & Reward
                    break;
                }
                case 3: {
                    // Point & Reward
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
        console.log('QR CODE WAS GENERATING');
        console.log(this.form.value);
        this.urlValue = this.form.value.url;

    }

    createCampaign(): void
    {
        console.log();
        
        // const data = this.form.value;
        // console.log(data);


        // data.userId = this.userId;
        // this._campaignsService.createOrder(data).then(response => {
        //     if (response.isSuccess === false){
        //         this._snackBar.open(response.message, 'Close', {
        //             duration: 5000,
        //             horizontalPosition: this.horizontalPosition,
        //             verticalPosition: this.verticalPosition,
        //             panelClass: ['error-snackbar']
        //         });
        //     }else{
        //         this._snackBar.open('Send data successed', 'Close', {
        //             duration: 5000,
        //             horizontalPosition: this.horizontalPosition,
        //             verticalPosition: this.verticalPosition,
        //             panelClass: ['success-snackbar']
        //         });
        //         this._router.navigate(['/apps/monitoring/campaign']);
        //     }
        // });
    }
}
