import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RedeemService } from '../redeem.service';

@Component({
    selector     : 'enrollment',
    templateUrl  : './enrollment.component.html',
    styleUrls    : ['./enrollment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class EnrollmentComponent implements OnInit
{
    enrollmentForm: FormGroup;

    token: string;
    campaignId: string;

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
        private _router: Router,
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

        this.message = undefined;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.enrollmentForm = this._formBuilder.group({
            phone   : ['', [Validators.required]],
            code   : ['', [Validators.required]],
            firstName : ['', [Validators.required]],
            lastName : ['', [Validators.required]],
            email : ['', [Validators.required, Validators.email]],
        });

    }

    enrollment(): void
    {
        const requestData = {
            phone  : this.enrollmentForm.value.phone,
            token   : this.token,
            code : this.enrollmentForm.value.code,
            campaignId: this.campaignId,
            firstName : this.enrollmentForm.value.firstName,
            lastName : this.enrollmentForm.value.lastName,
            email : this.enrollmentForm.value.email,
        };

        this._redeemService.registerEnrollment(requestData).then(response => {
            console.log(response);
            this.isRewardShow = true;
            this.message = response.message;

            // if (response.isExist)
            // {
            //     this.isRewardShow = true;
            //     this.message = response.message;
            // }
            // else
            // {
                // if (response.statusTypeCode === 'DUPLICATE'){

                // }
                // else if(response.statusTypeCode === 'SUCCESS'){

                // }
                // else if(response.statusTypeCode === 'FAIL'){

                // }
                // else{
                   
                //     let consumerId = 0;
                //     let FirstName = null;
                //     let LastName = null;
                //     let Email = null;

                //     if ( response.consumer != null){
                //         consumerId = response.consumer.id;
                //         FirstName = response.consumer.firstName;
                //         LastName = response.consumer.lastName;
                //         Email = response.consumer.email;
                //     }
                //     this._router.navigate(['redeem/enrollment/register'], {queryParams: {
                //                                                                         phone: this.enrollmentForm.value.phone,
                //                                                                         token: this.token, 
                //                                                                         campaignId: this.campaignId, 
                //                                                                         code: this.enrollmentForm.value.code,
                //                                                                         consumerId : consumerId,
                //                                                                         firstName: FirstName,
                //                                                                         lastName: LastName,
                //                                                                         email: Email,
                //                                                                     }});
                // }
                
           // }
        });
    }
}
