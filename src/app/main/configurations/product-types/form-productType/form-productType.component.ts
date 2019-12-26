import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationsStaffsService } from '../../staffs/staffs.service';
import { ConfigurationsProductTypesService } from '../product-types.service';

@Component({
    selector     : 'form-productType.component',
    templateUrl  : './form-productType.component.html',
    styleUrls    : ['./form-productType.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class FormProductTypeComponent implements OnInit
{
    productTypeForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    productTypeId: number;


    constructor(
        private _configurationsProductTypesService: ConfigurationsProductTypesService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {

        this.productTypeId = 0;
        this.productTypeForm = this._formBuilder.group({
            Id: 0,
            name   : [null, Validators.required],
            description   : [null, [Validators.required]],
            isActived: [null],

        });
        this.route.params.subscribe(params => {
            this.productTypeId = params['id'];
            if (this.productTypeId){
                this._configurationsProductTypesService.getProductTypesById(this.productTypeId).then(response => {
                    if (response.isSuccess === true){
                        this.productTypeForm = this._formBuilder.group({
                            Id: response.productType.id,
                            name   : [response.productType.name, Validators.required],
                            description   : [response.productType.description, Validators.required],
                            isActived: [response.productType.isActived, Validators.required],
                
                        });
                    }
                });
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

    saveProductType():void
    {
        if (this.productTypeForm.value.Id === 0){
            this._configurationsProductTypesService.saveProductType(this.productTypeForm.value).then(response => {
                if (response.isSuccess === false){
                    this._snackBar.open(response.message, 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['error-snackbar']
                    });
                }else{
                    this._snackBar.open('save data successed', 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['success-snackbar']
                    });
                    this._router.navigate(['/configurations/product-types']);
                }
            });
        }else{
            this._configurationsProductTypesService.updateProductType(this.productTypeForm.value).then(response => {
                if (response.isSuccess === false){
                    this._snackBar.open(response.message, 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['error-snackbar']
                    });
                }else{
                    this._snackBar.open('save data successed', 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['success-snackbar']
                    });
                    this._router.navigate(['/configurations/product-types']);
                }
            });
        }
        
    }


}


