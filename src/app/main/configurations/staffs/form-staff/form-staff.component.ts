import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationsStaffsService } from '../staffs.service';

@Component({
    selector     : 'form-staff',
    templateUrl  : './form-staff.component.html',
    styleUrls    : ['./form-staff.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class FormStaffComponent implements OnInit
{
    staffForm: FormGroup;
    roles: any[];
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    userId: number;


    constructor(
        private _configurationsStaffsService: ConfigurationsStaffsService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
        this._configurationsStaffsService.getRoles().then(response => {
            if (response.isSuccess){
                this.roles = response.roles;
            }
        });
        this.userId = 0;
        this.staffForm = this._formBuilder.group({
            Id: 0,
            firstName   : [null, Validators.required],
            lastName   : [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, Validators.required],
            roleId: [null, Validators.required],
            password: [null, Validators.required],
            isActived : [null]

        });
        this.route.params.subscribe(params => {
            this.userId = params['id'];
            if (this.userId){
                this._configurationsStaffsService.getStaff(this.userId).then(response => {
                    if (response.isSuccess === true){
                        console.log(response.staff);
                        this.staffForm = this._formBuilder.group({
                            Id: response.staff.id,
                            firstName   : [response.staff.firstName, Validators.required],
                            lastName   : [response.staff.lastName, Validators.required],
                            email: new FormControl({value: response.staff.email, disabled: true}, Validators.required),
                            phone: [response.staff.phone, Validators.required],
                            roleId: [response.staff.roleId, Validators.required],
                            password: new FormControl({value: '**********', disabled: true}, Validators.required),
                            isActived : [response.staff.isActived]
                
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

    saveStaff():void
    {
        if (this.staffForm.value.Id === 0){
            this._configurationsStaffsService.saveStaff(this.staffForm.value).then(response => {
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
                    this._router.navigate(['/configurations/staffs']);
                }
            });
        }else{
            this._configurationsStaffsService.updateStaff(this.staffForm.value).then(response => {
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
                    this._router.navigate(['/configurations/staffs']);
                }
            });
        }
        
    }


}


