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
import { FuseSidebarModule, FuseHighlightModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { ConsumersComponent } from './consumers.component';
import { ConsumersService } from './consumers.service';
import { MatPaginatorModule, MatSortModule, MatDialogModule, MatTooltipModule, MatProgressBarModule, MatToolbarModule, MatSnackBarModule, MatProgressSpinnerModule, MatInputModule, MatSlideToggleModule, MatSliderModule, MatOptionModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { ConsumerUploadDialogComponent } from './consumer-upload/consumer-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SubscriptionsSidebarComponent } from './sidebar/subscriptions-sidebar.component';
import { ConfigurationsProductTypesService } from 'app/main/configurations/product-types/product-types.service';
import { ConsumerPromotionDialogComponent } from './consumer-promotion/consumer-promotion.component';
import { AuthenticationGuard } from 'app/main/pages/authentication/authentication.guard';


const routes: Routes = [
    {
        path     : '**',
        component: ConsumersComponent,
        resolve  : {
            data: ConsumersService
        },
        canActivate: [
            AuthenticationGuard
        ]
    }
];

@NgModule({
    declarations: [
        ConsumersComponent,
        ConsumerUploadDialogComponent,
        SubscriptionsSidebarComponent,
        ConsumerPromotionDialogComponent
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
        MatProgressSpinnerModule,
        MatInputModule,
        MatSlideToggleModule,
        FuseSidebarModule,
        MatSliderModule,
        MatOptionModule,
        MatRadioModule,
        MatCheckboxModule,

        ChartsModule,
        NgxChartsModule,
        FileUploadModule,

        FuseSharedModule,
        FuseWidgetModule,

    ],
    providers   : [
        ConsumersService,
        AuthenticationGuard,
        ConfigurationsProductTypesService
    ],
    entryComponents: [
        ConsumerUploadDialogComponent,
        ConsumerPromotionDialogComponent
    ]
})
export class ConsumersModule
{
}

