import { NgModule } from '@angular/core';

import {
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule
} from '@angular/material';

import { CollectingModule } from './collecting/collecting.module';
import { RedeemService } from './redeem.service';
import { PointModule } from './point/point.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PointRegisterComponent } from './point-register/point-register.component';
import { ConfigurationsProductTypesService } from '../configurations/product-types/product-types.service';

@NgModule({
    imports: [
        CollectingModule,
        PointModule,
        EnrollmentModule
        // MatDatepickerModule,
        // MatFormFieldModule ,
        // MatNativeDateModule,
        // MatMomentDateModule,
        // MatButtonModule,
        // MatIconModule,
        // MatInputModule,
        // BrowserModule,
        // BrowserAnimationsModule,
    ],
    providers: [RedeemService]
})
export class RedeemModule {}
