import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MatButtonModule, MatIconModule, MatSlideToggleModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatSnackBarModule, MatDatepickerModule, MatRadioModule } from '@angular/material';
import { FuseHighlightModule } from '@fuse/components';

import { CampaignsComponent } from './campaigns.component';
import { AuthenticationGuard } from 'app/main/pages/authentication/authentication.guard';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CampaignsService } from './campaigns.service';

import { QRCodeModule } from 'angular2-qrcode';
import { DatePipe } from '@angular/common';
import { ConfigurationsProductsService } from 'app/main/configurations/products/products.service';
import { ConfigurationsDealersService } from 'app/main/configurations/dealers/dealers.service';

const routes = [
    {
        path     : 'create',
        component: CreateCampaignComponent,
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : '**',
        component: CampaignsComponent,
        canActivate: [
            AuthenticationGuard
        ],
        resolve  : {
            data: CampaignsService
        },
    }
];

@NgModule({
    declarations: [
        CampaignsComponent,
        CreateCampaignComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatInputModule,
        QRCodeModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatRadioModule,

        FuseHighlightModule,
        FuseSharedModule,
    ],
    exports     : [
        CampaignsComponent,
        CreateCampaignComponent
    ],
    providers: [
        AuthenticationGuard,
        CampaignsService,
        DatePipe,
        ConfigurationsProductsService,
        ConfigurationsDealersService,
    ]
})

export class CampaignsModule
{
}
