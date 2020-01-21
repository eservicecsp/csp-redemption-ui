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


import { AgmCoreModule } from '@agm/core';
import { MatPaginatorModule, MatSortModule, MatToolbarModule, MatProgressBarModule, MatDialogModule, MatTooltipModule, MatSnackBarModule, MatCheckboxModule, MatInputModule, MatDatepickerModule } from '@angular/material';
import { CommonModule, DatePipe } from '@angular/common';
import { CampaignsComponent, DialogDelete } from './campaigns.component';
import { CampaignsService } from './campaigns.service';
import { AuthenticationGuard } from 'app/main/pages/authentication/authentication.guard';
import { DashboardsCampaignsService } from '../dashboards/campaigns/dashboards-campaigns.service';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { CreateCampaignsService } from '../create-campaigns/create-campaigns.service';

const routes: Routes = [
    {
        path    : ':id/:name',
        component: CampaignDetailComponent,
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path    : ':id',
        component: CampaignDetailComponent,
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : '**',
        component: CampaignsComponent,
        resolve  : {
            data: CampaignsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    
];

@NgModule({
    declarations: [
        CampaignsComponent,
        DialogDelete,
        CampaignDetailComponent,
    ],
    imports     : [
        CommonModule,
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
        MatDatepickerModule,
        
        MatToolbarModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,

        AgmCoreModule.forRoot({
            apiKey: ''
        }),

        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule
    ],
    providers   : [
        AuthenticationGuard,
        CampaignsService,
        DashboardsCampaignsService,
        DatePipe,
        CreateCampaignsService
    ],
    entryComponents: [
        DialogDelete 
    ]
})
export class CampaignsModule
{
}

