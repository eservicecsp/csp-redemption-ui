import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfigurationsContactUsService } from './contact-us.service';


@Component({
    selector     : 'configurations-contact-us',
    templateUrl  : './contact-us.component.html',
    styleUrls    : ['./contact-us.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ConfigurationsContactUsComponent implements OnInit
{
    contactUsForm = this._formBuilder.group({
        tel: [''],
        facebook   : [''],
        line: [''],
        web : [''],
        shopOnline : [''],
    
    });
    Type = 'new';


    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
 
    constructor(
        private _formBuilder: FormBuilder,
        private _configurationsContactUsService: ConfigurationsContactUsService,
        private _snackBar: MatSnackBar,
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
        this._configurationsContactUsService.getContactUs().then(response => {
            console.log(response);
            if (response.isSuccess){
                if (response.contactUs != null){
                    this.Type = 'edit';
                    this.contactUsForm = this._formBuilder.group({
                        id: response.contactUs.id,
                        tel: [response.contactUs.tel],
                        facebook   : [response.contactUs.facebook],
                        line: [response.contactUs.line],
                        web : [response.contactUs.web],
                        shopOnline : [response.contactUs.shopOnline],
                    
                    });
                }
            }
        });
    }
    createContactUs(): void{
        this._configurationsContactUsService.saveContactUs(this.contactUsForm.value).then(response => {
            console.log(response);
            if (response.isSuccess){
                this._snackBar.open('save data successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
            } else {
                this._snackBar.open(response.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['error-snackbar']
                });
            }
        }, error => {
            this._snackBar.open(error, 'Close', {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                panelClass: ['error-snackbar']
            });
        });
    }
    updateContactUs(): void{
        this._configurationsContactUsService.updateContactUs(this.contactUsForm.value).then(response => {
            console.log(response);
            if (response.isSuccess){
                this._snackBar.open('save data successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
            } else {
                this._snackBar.open(response.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['error-snackbar']
                });
            }
        }, error => {
            this._snackBar.open(error, 'Close', {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                panelClass: ['error-snackbar']
            });
        });
    }
}
