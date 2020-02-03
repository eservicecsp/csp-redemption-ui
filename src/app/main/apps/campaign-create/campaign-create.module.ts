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
import { QRCodeModule } from 'angular2-qrcode';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';


import { AgmCoreModule } from '@agm/core';
import { MatPaginatorModule, MatSortModule, MatToolbarModule, MatProgressBarModule, MatDialogModule, MatTooltipModule, MatSnackBarModule, MatCheckboxModule, MatInputModule, MatDatepickerModule, MatRadioModule } from '@angular/material';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthenticationGuard } from 'app/main/pages/authentication/authentication.guard';
import { DashboardsCampaignsService } from '../dashboards/campaigns/dashboards-campaigns.service';
import { CreateCampaignsService } from '../create-campaigns/create-campaigns.service';
import { ConfigurationsDealersService } from 'app/main/configurations/dealers/dealers.service';
import { ConfigurationsProductsService } from 'app/main/configurations/products/products.service';

import { EnrollmentUploadDialogComponent } from '../dashboards/campaigns/enrollment-upload/enrollment-upload.component';
import { ConsumersService } from '../consumers/consumers.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CampaignCreateComponent } from './campaign-create.component';
import { CampaignDetailFromComponent } from './campaign-create-form/campaign-create-form.component';
import { ConfigurationsContactUsService } from 'app/main/configurations/contact-us/contact-us.service';
// import { CampaignDetailComponent } from './campaign-create-form/campaign-create-form.component';

const routes: Routes = [

    {
        path     : 'form',
        component: CampaignDetailFromComponent,
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : '**',
        component: CampaignCreateComponent,
        resolve  : {
            data: CreateCampaignsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    
];

@NgModule({
    declarations: [
        //QRDialogComponent,
        CampaignCreateComponent,
        EnrollmentUploadDialogComponent,
        CampaignDetailFromComponent
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
        QRCodeModule,
        MatRadioModule,

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
        CreateCampaignsService,
        ConfigurationsDealersService,
        ConfigurationsProductsService,
        ConsumersService,
        ConfigurationsContactUsService
    ],
    entryComponents: [
        EnrollmentUploadDialogComponent,
        CampaignDetailFromComponent
    ]
})
export class CampaignCreateModule
{
}

