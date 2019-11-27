import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { CollectingComponent } from './collecting.component';
import { CollectingRegisterComponent } from '../collecting-register/collecting-register.component';
import { MatSelectModule } from '@angular/material';

const routes = [
    {
        path     : 'collecting',
        component: CollectingComponent
    },
    {
        path     : 'collecting/register',
        component: CollectingRegisterComponent
    }
];

@NgModule({
    declarations: [
        CollectingComponent,
        CollectingRegisterComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,

        FuseSharedModule
    ]
})
export class CollectingModule
{
}
