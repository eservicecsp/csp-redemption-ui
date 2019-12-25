import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { ConfigurationsPromotionsService } from '../promotions.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

@Component({
    selector     : 'promotion-detail',
    templateUrl  : './promotion-detail.component.html',
    styleUrls    : ['./promotion-detail.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PromotionDetailComponent implements OnInit
{
    promotionForm = this._formBuilder.group({
        id: [0],
        name   : ['', [Validators.required]],
        description: ['', Validators.required],
        createdBy : this._authenticationService.getRawAccessToken('userId'),
        attachments: this._formBuilder.array([])
    });

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    pageType: string;

    promotionId: number;

    promotion: any;

    constructor(
        private _configurationsPromotionService: ConfigurationsPromotionsService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
        this.promotionId = 0;
        this.promotion = {
            
        };

        this.route.params.subscribe(params => {
            this.promotionId = params['id'];
            if (this.promotionId > 0){
                this.pageType = 'edit';

                this._configurationsPromotionService.getPromotionById(this.promotionId).then(response => {
                    if (response.isSuccess)
                    {
                        this.promotion = response.promotion;

                        this.promotionForm = this._formBuilder.group({
                            id: this.promotionId,
                            name   : [response.promotion.name, [Validators.required]],
                            description: [response.promotion.description, Validators.required]
                        });
                        
                    }
                });
            }
            else
            {
                this.pageType = 'new';
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
        
    }

    getControl(frmGrp: FormGroup, key: string): any {
        return (frmGrp.controls[key] as FormControl);
    }
    
    getControls(formGroup: FormGroup, fromControl: string): any{
        return (formGroup.controls[fromControl] as FormArray).controls;
    }

}


