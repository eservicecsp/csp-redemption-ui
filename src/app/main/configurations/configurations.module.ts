import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { MatProgressBarModule, MatToolbarModule, MatDialogModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { AuthenticationGuard } from '../pages/authentication/authentication.guard';
import { ConfigurationsStaffsComponent } from './staffs/staffs.component';
import { ConfigurationsStaffsService } from './staffs/staffs.service';


const routes: Routes = [
    {
        path     : 'staffs',
        component: ConfigurationsStaffsComponent,
        resolve  : {
            data: ConfigurationsStaffsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    }
];

@NgModule({
    declarations: [
        ConfigurationsStaffsComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatDialogModule,
        MatTooltipModule,
        MatProgressSpinnerModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers   : [
        ConfigurationsStaffsService,
        AuthenticationGuard
    ]
})
export class ConfigurationsModule
{
}