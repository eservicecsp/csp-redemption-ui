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
        createdBy: [0],
        promotionTypeId: [0, [Validators.required]],
        isActived: [false, [Validators.required]],
    });

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    pageType: string;

    promotionId: number;
    promotion = {
        id: 0,
        name: undefined,
        description: undefined,
        isActived: false,
        promotionTypeId: 0
    };
    promotionTypes: [];

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

        this._configurationsPromotionService.getPromotionTypes().then(response => {
            if (response.isSuccess){
                this.promotionTypes = response.promotionTypes;
            }
            else {

            }
        });

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
                            name   : [this.promotion.name, [Validators.required]],
                            description: [this.promotion.description, Validators.required],
                            promotionTypeId: [this.promotion.promotionTypeId, [Validators.required]],
                            isActived: [this.promotion.isActived, [Validators.required]]
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

    createPromotion(): void
    {
        console.log(this.promotionForm.value);
    }

    updatePromotion(): void
    {
        console.log(this.promotionForm.value);
    }

}


