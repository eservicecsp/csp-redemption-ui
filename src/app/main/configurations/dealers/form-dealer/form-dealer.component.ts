import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationsDealersService } from '../dealers.service';

@Component({
    selector     : 'form-dealer',
    templateUrl  : './form-dealer.component.html',
    styleUrls    : ['./form-dealer.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class FormDealerComponent implements OnInit
{
    dealerForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    dealerId: number;


    constructor(
        private _configurationsDealersService: ConfigurationsDealersService,
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
        this.dealerId = 0;
        this.dealerForm = this._formBuilder.group({
            Id: this.dealerId,
            name   : [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            TaxNo: [null, Validators.required],
            phone: [null, Validators.required],
            tel: [null, Validators.required],
            createdBy : this._authenticationService.getRawAccessToken('userId')

        });

        this.route.params.subscribe(params => {
            this.dealerId = params['id'];
            if (this.dealerId){
                this._configurationsDealersService.getDealer(this.dealerId).then(response => {
                    if (response.isSuccess === true){
                        this.dealerForm = this._formBuilder.group({
                            Id: this.dealerId,
                            name   : [response.dealer.name, Validators.required],
                            email: [response.dealer.email, [Validators.required, Validators.email]],
                            TaxNo: [response.dealer.taxNo, Validators.required],
                            phone: [response.dealer.phone, Validators.required],
                            tel: [response.dealer.tel, Validators.required]
                        });
                    }
                });
            }
         });
    }

    saveDealer():void
    {
        if (this.dealerForm.value.Id === 0){
            this._configurationsDealersService.saveDealer(this.dealerForm.value).then(response => {
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
                    this._router.navigate(['/configurations/dealers']);
                }
            });
        }else{
            this._configurationsDealersService.updateDealer(this.dealerForm.value).then(response => {
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
                    this._router.navigate(['/configurations/dealers']);
                }
            });
        }
        
    }


}


