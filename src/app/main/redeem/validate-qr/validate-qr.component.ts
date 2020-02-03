import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RedeemService } from '../redeem.service';
import { Subject } from 'rxjs';
import { PointComponent } from '../point/point.component';

@Component({
    selector: 'validate-qr',
    templateUrl: './validate-qr.component.html',
    styleUrls: ['./validate-qr.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ValidateQrComponent implements OnInit, OnDestroy {
    // pointForm: FormGroup;

    token: string;
    campaignId: string;

    // Validate response
    message: string;
    statusTypeCode: string;
    scanDate: string;
    tel: string;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _redeemService: RedeemService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // get return url from route parameters or default to '/'
        this.token = this._route.snapshot.queryParams.token;
        this.campaignId = this._route.snapshot.queryParams.campaignId;

        this.message = undefined;
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this._redeemService.checkQrCode().then(response => {
        //     this.message = response.message;
        //     this.statusTypeCode = response.statusTypeCode;
        //     this.scanDate = response.scanDate;
        //     this.tel = response.tel;

        //     if (this.statusTypeCode === 'SUCCESS') {
        //         setTimeout(() => {
        //             // this._redeemService.onValidatedChanged.next(true);
        //         }, 3000);
        //     }
        // });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
