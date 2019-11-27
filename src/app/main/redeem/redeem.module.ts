import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material';

import { CollectingModule } from './collecting/collecting.module';
import { RedeemService } from './redeem.service';
import { CollectingRegisterModule } from './collecting-register/collecting-register.module';


@NgModule({
    imports: [
        CollectingModule,
        // CollectingRegisterModule,
    ],
    providers: [
        RedeemService,
    ]
})
export class RedeemModule
{

}
