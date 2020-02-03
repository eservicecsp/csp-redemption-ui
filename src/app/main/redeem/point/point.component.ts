import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RedeemService } from '../redeem.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'point',
    templateUrl: './point.component.html',
    styleUrls: ['./point.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PointComponent implements OnInit, OnDestroy {
    pointForm: FormGroup;

    token: string;
    campaignId: string;
    statusTypeCode: string;

    isRewardShow: boolean;
    message: string;
    latitude: string;
    longitude: string;
    routerLink: string;

    // Validate params
    isValidated: boolean;
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

        this.isValidated = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.pointForm = this._formBuilder.group({
            phone: ['', [Validators.required]]
        });

        if (!this.isValidated) {
            const data = {
                token: this.token,
                campaignId: this.campaignId,
            };
            this._redeemService.checkQrCode(data).then(response => {
                this.message = response.message;
                this.statusTypeCode = response.statusTypeCode;
                this.scanDate = response.scanDate;
                this.tel = response.tel;

                if (this.statusTypeCode === 'SUCCESS') {
                    setTimeout(() => {
                        this.isValidated = true;
                        this._redeemService.getPosition().then(
                            position => {
                                this.latitude = position.coords.latitude;
                                this.longitude = position.coords.longitude;
                            },
                            error => {
                                this.latitude = null;
                                this.longitude = null;
                            }
                        );
                    }, 3000);
                }
            });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    point(): void {
        const requestData = {
            phone: this.pointForm.value.phone,
            token: this.token,
            campaignId: this.campaignId,
            latitude: this.latitude,
            longitude: this.longitude
        };
        this._redeemService.isExist(requestData).then(response => {
            if (response.isExist) {
                // FAIL
                // EMPTY, DUPLICATE
                // SUCCESS
                this.isRewardShow = true;
                this.message = response.message;
                this.statusTypeCode = response.statusTypeCode;
                this.routerLink =
                    'https://etax.chanwanich.com/csp-redemption-front-ui/apps/home?phone=' +
                    this.pointForm.value.phone +
                    '&brandId=' +
                    response.brandId;
            } else {
                // this._router.navigate(['redeem/point/register', {token: this.token, campaignId: this.campaignId}]);
                if (response.statusTypeCode === 'DUPLICATE') {
                } else if (response.statusTypeCode === 'SUCCESS') {
                } else if (response.statusTypeCode === 'FAIL') {
                } else {
                    this._router.navigate(['redeem/point/register'], {
                        queryParams: {
                            token: this.token,
                            campaignId: this.campaignId,
                            phone: this.pointForm.value.phone
                        }
                    });
                }
            }
        });
    }
    closeResponse(): void {
        this.pointForm.reset();
        this.isRewardShow = false;
    }
}
