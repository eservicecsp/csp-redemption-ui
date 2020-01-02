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

    provinces: any[];
    amphurs: any[];
    tumbols: any[];


    constructor(
        private _configurationsDealersService: ConfigurationsDealersService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
        this._configurationsDealersService.getProvinces().then(response => {
            this.provinces = response.provinces;
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
        this.dealerId = 0;
        this.dealerForm = this._formBuilder.group({
            Id: this.dealerId,
            branchNo: [null, Validators.required],
            name   : [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            TaxNo: [null, Validators.required],
            phone: [null, Validators.required],
            tel: [null, Validators.required],
            address1   : [null, Validators.required],
            address2   : [null],
            tumbolCode: [null, Validators.required],
            amphurCode: [null, Validators.required],
            provinceCode: [null, Validators.required],
            zipCode: [null, Validators.required],
            createdBy : this._authenticationService.getRawAccessToken('userId')

        });

        this.route.params.subscribe(params => {
            this.dealerId = params['id'];
            if (this.dealerId){
                this._configurationsDealersService.getDealer(this.dealerId).then(response => {
                    if (response.isSuccess === true){
                        if ( response.dealer.amphurCode != null){
                            
                            this._configurationsDealersService.getAmphurs(response.dealer.provinceCode).then( response => {
                                this.amphurs = response.amphurs;
                            });
                        }
                        if ( response.dealer.tumbolCode != null){

                            this._configurationsDealersService.getTumbols(response.dealer.amphurCode).then( response => {
                                this.tumbols = response.tumbols;
                            });
                        }

                        this.dealerForm = this._formBuilder.group({
                            Id: this.dealerId,
                            branchNo: [response.dealer.branchNo, Validators.required],
                            name   : [response.dealer.name, Validators.required],
                            email: [response.dealer.email, [Validators.required, Validators.email]],
                            TaxNo: [response.dealer.taxNo, Validators.required],
                            phone: [response.dealer.phone, Validators.required],
                            tel: [response.dealer.tel, Validators.required],
                            address1   : [response.dealer.address1, Validators.required],
                            address2   : [response.dealer.address2],
                            tumbolCode: [response.dealer.tumbolCode, Validators.required],
                            amphurCode: [response.dealer.amphurCode, Validators.required],
                            provinceCode: [response.dealer.provinceCode, Validators.required],
                            zipCode: [response.dealer.zipCode, Validators.required],
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

    getAmphurs(event): void
    {
        const provinceCode = event.value;
        this._configurationsDealersService.getAmphurs(provinceCode).then(response => {
            this.amphurs = response.amphurs;
        });
    }

    getTumbols(event): void
    {
        const amphurCode = event.value;
        this._configurationsDealersService.getTumbols(amphurCode).then(response => {
            this.tumbols = response.tumbols;
        });
    }

    getZipcode(event): void
    {
        const tumbolCode = event.value;
        const tumbol = this.tumbols.find(x=>x.code === tumbolCode);
        if (tumbol.zipCode)
        {
            this.dealerForm.controls['zipCode'].patchValue( tumbol.zipCode);
        }
    }


}


