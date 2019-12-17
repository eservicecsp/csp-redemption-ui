import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { DashboardsCampaignsComponent } from './dashboards-campaigns.component';

import { AuthenticationGuard } from 'app/main/pages/authentication/authentication.guard';
import { DashboardsCampaignsService } from './dashboards-campaigns.service';

import { AgmCoreModule } from '@agm/core';
import { MatPaginatorModule, MatSortModule, MatToolbarModule, MatProgressBarModule, MatDialogModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';
import { QRCodeModule } from 'angular2-qrcode';
import { CommonModule } from '@angular/common';
import { QRDialogComponent } from './qr-dialog/qr-dialog.component';

const routes: Routes = [
    {
        path     : '**',
        component: DashboardsCampaignsComponent,
        resolve  : {
            data: DashboardsCampaignsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    }
];

@NgModule({
    declarations: [
        DashboardsCampaignsComponent,
        // QRDialogComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatSnackBarModule,
        NgxChartsModule,
        CommonModule,
        MatToolbarModule,
        AgmCoreModule.forRoot({
            apiKey: ''
        }),

        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule
    ],
    providers   : [
        DashboardsCampaignsService,
        AuthenticationGuard
    ],
    // entryComponents: [
    //     QRDialogComponent
    // ]
})
export class DashboardsCampaignsModule
{
}

