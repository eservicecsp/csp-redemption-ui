import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatDialog, MatDialogRef } from '@angular/material';
// import { ProgressSpinnerDialogComponent } from 'app/main/progress-spinner-dialog/progress-spinner-dialog.component';

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    brandForm: FormGroup;

    staffForm: FormGroup;

    hidePassword = true;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private http: HttpClient,
        private _authenticationService: AuthenticationService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private _matDialog: MatDialog,
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.brandForm = this._formBuilder.group({
            name     : [undefined, [Validators.required]],
            code  : [undefined, [Validators.required]],
        });

        this.staffForm = this._formBuilder.group({
            id      : [0],
            firstName: [undefined, [Validators.required]],
            lastName: [undefined, [Validators.required]],
            email: [undefined, [Validators.required, Validators.email]],
            password: [undefined, [Validators.required]],
            passwordConfirm: [undefined, [Validators.required, confirmPasswordValidator]],
            phone: [undefined, [Validators.required]],
            brandId: [0, [Validators.required]],
            roleId: [0, [Validators.required]],
            isActived: [true]
        });

        // Validators.pattern('^([0-9]{10,13}|[0-9]{13})$'),

      
        // // Update the validity of the 'passwordConfirm' field
        // // when the 'password' field changes
        // this.registerForm.get('password').valueChanges
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(() => {
        //         this.registerForm.get('passwordConfirm').updateValueAndValidity();
        //     });
    }

    /**
     * On destroy
     */


    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    
    onSubmit(): void 
    {
        // const loadingDialogRef: MatDialogRef<ProgressSpinnerDialogComponent> = this._matDialog.open(ProgressSpinnerDialogComponent, {
        //     panelClass: 'transparent',
        //     disableClose: true
        // });

        const data = {
            brand : this.brandForm.value,
            staff : this.staffForm.value,
        };
        //console.log(data);
        this._authenticationService.register(data).then(res => {
            console.log(data);
            if (res.isSuccess === true){
                this._snackBar.open('Register completed.', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['blue-snackbar']
                });
                this.router.navigate(['/pages/auth/login']);
                //loadingDialogRef.close();
            }else{
                this._snackBar.open(res.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['blue-snackbar']
                });
                //loadingDialogRef.close();
            }
        });
        
        
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};

export const NoWhitespaceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }
    const username = control.parent.get('username');
    if ( username.value === '' )
    {
        return null;
    }

    const isWhitespace = username.value.indexOf(' ') !== -1;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace : true };
};
