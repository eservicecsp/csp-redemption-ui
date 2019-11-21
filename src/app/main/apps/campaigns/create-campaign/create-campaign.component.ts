import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { CampaignsService } from '../campaigns.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    
    form: FormGroup;
    urlValue: string;
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

    create(): void
    {
        const data = this.form.value;
        console.log(data);
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
