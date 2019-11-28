import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material';

import { CollectingModule } from './collecting/collecting.module';
import { RedeemService } from './redeem.service';
import { PointModule } from './point/point.module';


@NgModule({
    imports: [
        CollectingModule,
        PointModule,
    ],
    providers: [
        RedeemService,
    ]
})
export class RedeemModule
{

}
