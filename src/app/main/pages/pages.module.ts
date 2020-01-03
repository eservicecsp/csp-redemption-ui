import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material';

import { LoginModule } from './authentication/login/login.module';
import { RegisterModule } from './authentication/register/register.module';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';

import { Error404Module } from './errors/404/error-404.module';


@NgModule({
    imports: [
        // Authentication
        LoginModule,
        // RedeemModule,
        RegisterModule,
        // ForgotPasswordModule,
        ResetPasswordModule,
        // MailConfirmModule,

        // Errors
        Error404Module,
        // Error500Module,

        // Maintenance
        // MaintenanceModule,
    ]
})
export class PagesModule
{

}
