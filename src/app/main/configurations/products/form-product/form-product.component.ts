import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { ConfigurationsProductsService } from '../products.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector     : 'form-product',
    templateUrl  : './form-product.component.html',
    styleUrls    : ['./form-product.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class FormProductComponent implements OnInit
{
    productForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    productId: number;


    constructor(
        private _configurationsProductsService: ConfigurationsProductsService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.productId = 0;
        this.productForm = this._formBuilder.group({
            Id: this.productId,
            name   : ['', [Validators.required]],
            description: ['', Validators.required],
            createdBy : this._authenticationService.getRawAccessToken('userId')

        });

        this.route.params.subscribe(params => {
            this.productId = params['id'];
            if (this.productId){
                this._configurationsProductsService.getProductsById(this.productId).then(response => {
                    if (response.isSuccess === true){
                        console.log(response.product);
                        this.productForm = this._formBuilder.group({
                            Id: this.productId,
                            name   : [response.product.name, [Validators.required]],
                            description: [response.product.description, Validators.required],
                
                        });
                    }
                });
            }
         });
    }

    saveProduct():void
    {
        if (this.productForm.value.Id === 0) {
            this._configurationsProductsService.saveProduct(this.productForm.value).then(response => {
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
                    this._router.navigate(['/configurations/products']);
                }
            });
        }else{
            this._configurationsProductsService.updateProduct(this.productForm.value).then(response => {
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
                    this._router.navigate(['/configurations/products']);
                }
            });
        }
       
    }


}


