import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

// import { PointRegisterComponent } from '../point-register/point-register.component';
import { MatSelectModule, MatDatepickerModule } from '@angular/material';
import { EnrollmentComponent } from './enrollment.component';
import { EnrollmentRegisterComponent } from '../enrollment-register/enrollment-register.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes = [
    {
        path     : 'enrollment',
        component: EnrollmentComponent
    },
    {
        path     : 'enrollment/register',
        component: EnrollmentRegisterComponent
    }
];

@NgModule({
    declarations: [
        EnrollmentComponent,
        EnrollmentRegisterComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        // BrowserModule,
        // BrowserAnimationsModule,
        

        FuseSharedModule
    ]
})
export class EnrollmentModule
{
}
