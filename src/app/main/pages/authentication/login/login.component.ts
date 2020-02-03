import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { ProgressSpinnerDialogComponent } from 'app/main/progress-spinner-dialog/progress-spinner-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;

    returnUrl: string;
    errorMessage: string;

    isLoading: boolean;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _matDialog: MatDialog,
        private _fuseNavigationService: FuseNavigationService,
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

        // get return url from route parameters or default to '/'
        //this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/apps/dashboards/campaigns';
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || 'apps/graph';
        //this.returnUrl = this._route.snapshot.queryParams['returnUrl'] === undefined ? 'apps/campaigns' : this._route.snapshot.queryParams['returnUrl'];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit(value: any): void
    {
        this.isLoading = true;
        this._fuseProgressBarService.show();
        
        if (this.loginForm.invalid)
        {
            this.isLoading = false;
            this._fuseProgressBarService.hide();
            return;
        }

        this._authenticationService.login(value).then(response => {
            if (response.isSuccess)
            {
                this.isLoading = false;
                this._fuseProgressBarService.hide();
                if (response.resetPasswordToken){
                    this._router.navigate(['pages/auth/reset-password'], { queryParams: { email: this.loginForm.value.email, token: response.resetPasswordToken} });
                }
                else{
                    this._router.navigate([this.returnUrl]);
                }
            }
            else 
            {
                this._fuseProgressBarService.hide();
                this.isLoading = false;
            }
        }, error => {
            this.isLoading = false;
            this._fuseProgressBarService.hide();
            this.errorMessage = 'Invalid email or password';
        });
    }
}
