import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MatButtonModule, MatIconModule, MatSlideToggleModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatSnackBarModule, MatDatepickerModule, MatRadioModule, MatListModule } from '@angular/material';
import { FuseHighlightModule } from '@fuse/components';
import { CreateCampaignsService } from './create-campaigns.service';

import { QRCodeModule } from 'angular2-qrcode';
import { DatePipe } from '@angular/common';
import { ConfigurationsProductsService } from 'app/main/configurations/products/products.service';
import { ConfigurationsDealersService } from 'app/main/configurations/dealers/dealers.service';
import { AuthenticationGuard } from 'app/main/pages/authentication/authentication.guard';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CreateCampaignsComponent } from './create-campaigns.component';
import { ConfigurationsContactUsService } from 'app/main/configurations/contact-us/contact-us.service';

const routes = [
    {
        path     : 'detail',
        component: CreateCampaignComponent,
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : '**',
        component: CreateCampaignsComponent,
        canActivate: [
            AuthenticationGuard
        ],
        resolve  : {
            data: CreateCampaignsService
        },
    }
];

@NgModule({
    declarations: [
        CreateCampaignsComponent,
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
        MatListModule
    ],
    exports     : [
        CreateCampaignsComponent,
        CreateCampaignComponent
    ],
    providers: [
        AuthenticationGuard,
        CreateCampaignsService,
        DatePipe,
        ConfigurationsProductsService,
        ConfigurationsDealersService,
        ConfigurationsContactUsService,
    ]
})

export class CreateCampaignsModule
{
}
