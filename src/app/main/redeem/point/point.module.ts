import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { PointComponent } from './point.component';
import { PointRegisterComponent } from '../point-register/point-register.component';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { DatePipe } from '@angular/common';

const routes = [
    {
        path     : 'point',
        component: PointComponent
    },
    {
        path     : 'point/register',
        component: PointRegisterComponent
    }
];

@NgModule({
    declarations: [
        PointComponent,
        PointRegisterComponent,
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
        MatNativeDateModule,
        // BrowserModule ,
        // BrowserAnimationsModule,
        // CommonModule,
        

        FuseSharedModule
    ]
    ,
    providers: [
        DatePipe,
    ]
})
export class PointModule
{
}
