import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, pipe } from 'rxjs';
import { CampaignsService } from '../campaigns.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CreateCampaignsService } from '../../create-campaigns/create-campaigns.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { ConfigurationsDealersService } from 'app/main/configurations/dealers/dealers.service';
import { ConfigurationsProductsService } from 'app/main/configurations/products/products.service';

@Component({
    selector   : 'campaign-detail',
    templateUrl: './campaign-detail.component.html',
    styleUrls  : ['./campaign-detail.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CampaignDetailComponent implements OnInit, OnDestroy
{
    dealerList: [];
    collectingData: any[];
    collectingType: number;
    campaignTypeId: number;
    products: any[];
    campaign = {
        id: 0,
        name: '',
    };
    campaignForm = this._campaignFormBuilder.group({
        name : undefined,
        waste : 0,
        description : undefined,
        product: undefined,
        startDate : new Date(),
        endDate : new Date(),
        alertMessage : undefined,
        duplicateMessage : undefined,
        qrCodeNotExistMessage : undefined,
        winMessage : undefined,
        dealers: undefined,
        tel: undefined,
        facebook : undefined,
        line: undefined,
        web : undefined,
    });
    
    
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    
    // Private
    private _unsubscribeAll: Subject<any>;
     
    /**
     * Constructor
     */
    constructor(
        private readonly _campaignsService: CampaignsService,
        private readonly _campaignFormBuilder: FormBuilder,
        private readonly _datePipe: DatePipe,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _createCampaignsService: CreateCampaignsService,
        private readonly _snackBar: MatSnackBar,
        private _configurationsDealersService: ConfigurationsDealersService,
        private _configurationsProductsService: ConfigurationsProductsService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._configurationsDealersService.getDealers().then(response => {
            if (response.isSuccess) {
                this.dealerList = response.dealers;
            }
        });
    }

    ngOnInit(): void
    {
        this._configurationsProductsService.getProducts().then(res => {
            if (res.isSuccess){
                this.products = res.products;
            }
        });
        const campaignId = this._route.snapshot.params['id'];
        this._campaignsService.getCampaign(campaignId).then(response => {
            this.campaign = response.campaign;
            this.campaignTypeId = this.campaign['campaignTypeId'];

            if (this.campaignTypeId === 1){
                this.collectingType = this.campaign['collectingType'];
                this.collectingData = this.campaign['collectingData'];
            }


            this.campaignForm = this._campaignFormBuilder.group({
                name : [this.campaign['name']],
                waste : [this.campaign['waste']],
                description : [this.campaign['description']],
                product: [{value: this.campaign['product'], disabled: true}],
                startDate : [this._datePipe.transform(this.campaign['startDate'], 'yyyy-MM-dd')],
                endDate : [this._datePipe.transform(this.campaign['endDate'], 'yyyy-MM-dd')],
                alertMessage : [this.campaign['alertMessage']],
                duplicateMessage : [this.campaign['duplicateMessage']],
                qrCodeNotExistMessage : [this.campaign['qrCodeNotExistMessage']],
                winMessage : [this.campaign['winMessage']],
                dealers: [undefined],
                tel: [this.campaign['tel']],
                facebook : [this.campaign['facebook']],
                line: [this.campaign['line']],
                web : [this.campaign['web']],
            });

            let dealers = [];
            this.campaign['dealers'].forEach(element => {
                dealers.push(element.id);
            });
            this.campaignForm.controls['dealers'].setValue(dealers); 
        });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createCampaign(): void
    {
        const request = {
            Id: this.campaign.id,
            Name: this.campaignForm.value.name,
            Description: this.campaignForm.value.description,
            StartDate:  moment(this.campaignForm.value.startDate).format('YYYY-MM-DD'),
            EndDate:  moment(this.campaignForm.value.endDate).format('YYYY-MM-DD'),
            AlertMessage: this.campaignForm.value.alertMessage,
            DuplicateMessage: this.campaignForm.value.duplicateMessage,
            QrCodeNotExistMessage: this.campaignForm.value.qrCodeNotExistMessage,
            WinMessage: this.campaignForm.value.winMessage,
            tel: this.campaignForm.value.tel === '' ? null : this.campaignForm.value.tel,
            facebook: this.campaignForm.value.facebook === '' ? null : this.campaignForm.value.facebook,
            line: this.campaignForm.value.line === '' ? null : this.campaignForm.value.line,
            web: this.campaignForm.value.web === '' ? null : this.campaignForm.value.web,
       };
        this._createCampaignsService.updateCampaign(request).then(response => {
            if (response.isSuccess === false){
                this._snackBar.open(response.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['error-snackbar']
                });
            }else{
                this._snackBar.open('Update capmaign successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
                this._router.navigate(['apps/campaigns']);
            }
        });
    }
}
