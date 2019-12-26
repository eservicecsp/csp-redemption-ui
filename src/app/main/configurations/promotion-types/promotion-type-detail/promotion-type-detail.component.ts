import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { ConfigurationsPromotionTypesService } from '../promotion-types.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

@Component({
    selector     : 'promotion-type-detail',
    templateUrl  : './promotion-type-detail.component.html',
    styleUrls    : ['./promotion-type-detail.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class PromotionTypeDetailComponent implements OnInit
{
    promotionTypeForm = this._formBuilder.group({
        id: [0],
        name   : ['', [Validators.required]],
        description: ['', Validators.required],
        // createdBy: this._authenticationService.getRawAccessToken('userId'),
        // promotionTypeId: [0, [Validators.required]],
        // isActived: [false, [Validators.required]],
    });

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    pageType: string;
    promotionTypeId: any;
    promotionType = {
        id: 0,
        name: undefined,
        description: undefined
    };

    constructor(
        private _configurationsPromotionTypesService: ConfigurationsPromotionTypesService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
        this.route.params.subscribe(params => {
            this.promotionTypeId = params['id'];
            if (this.promotionTypeId > 0){
                console.log(this.promotionTypeId)
                this.pageType = 'edit';

                this._configurationsPromotionTypesService.getPromotionTypeById(this.promotionTypeId).then(response => {
                    if (response.isSuccess)
                    {
                        this.promotionType = response.promotionType;
                        this.promotionTypeForm = this._formBuilder.group({
                            id: this.promotionTypeId,
                            name   : [this.promotionType.name, [Validators.required]],
                            description: [this.promotionType.description, Validators.required],
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

    createPromotionType(): void
    {
        this._configurationsPromotionTypesService.createPromotionType(this.promotionTypeForm.value).then(response => {
            if (response.isSuccess){
                this._router.navigate(['configurations/promotion-types']);
            } else {
                console.error('fail');
            }
        }, error => {
           console.error(error); 
        });
    }

    updatePromotionType(): void
    {
        this._configurationsPromotionTypesService.updatePromotionType(this.promotionTypeForm.value).then(response => {
            if (response.isSuccess){
                this._router.navigate(['configurations/promotion-types']);
            } else {
                console.error('fail');
            }
        }, error => {
           console.error(error); 
        });
    }

}


