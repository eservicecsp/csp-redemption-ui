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

import { MatProgressBarModule, MatToolbarModule, MatDialogModule, MatTooltipModule, MatProgressSpinnerModule, MatSlideToggleModule } from '@angular/material';
import { AuthenticationGuard } from '../pages/authentication/authentication.guard';
import { ConfigurationsStaffsComponent } from './staffs/staffs.component';
import { ConfigurationsStaffsService } from './staffs/staffs.service';
import { ConfigurationsDealersComponent } from './dealers/dealers.component';
import { ConfigurationsDealersService } from './dealers/dealers.service';
import { ConfigurationsProductsComponent } from './products/products.component';
import { ConfigurationsProductsService } from './products/products.service';
import { FormProductComponent } from './products/form-product/form-product.component';
import { FormDealerComponent } from './dealers/form-dealer/form-dealer.component';
import { FormStaffComponent } from './staffs/form-staff/form-staff.component';
import { ConfigurationsProductTypesComponent } from './product-types/product-types.component';
import { ConfigurationsProductTypesService } from './product-types/product-types.service';
import { ConfigurationsPromotionsComponent } from './promotions/promotions.component';
import { ConfigurationsPromotionsService } from './promotions/promotions.service';
import { FormProductTypeComponent } from './product-types/form-productType/form-productType.component';


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
    },
    {
        path     : 'staffs/create',
        component: FormStaffComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'staffs/:id',
        component: FormStaffComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'dealers',
        component: ConfigurationsDealersComponent,
        resolve  : {
            data: ConfigurationsDealersService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'dealers/create',
        component: FormDealerComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'dealers/:id',
        component: FormDealerComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'products',
        component: ConfigurationsProductsComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'products/create',
        component: FormProductComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'products/:id',
        component: FormProductComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'product-types',
        component: ConfigurationsProductTypesComponent,
        resolve  : {
            data: ConfigurationsProductTypesService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'product-types/:id',
        component: FormProductTypeComponent,
        resolve  : {
            data: ConfigurationsProductTypesService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'promotions',
        component: ConfigurationsPromotionsComponent,
        resolve  : {
            data: ConfigurationsPromotionsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
];

@NgModule({
    declarations: [
        ConfigurationsStaffsComponent,
        ConfigurationsDealersComponent,
        ConfigurationsProductsComponent,
        ConfigurationsProductTypesComponent,
        ConfigurationsPromotionsComponent,
        FormProductComponent,
        FormDealerComponent,
        FormStaffComponent,
        FormProductTypeComponent 

        
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
        MatSlideToggleModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers   : [
        ConfigurationsStaffsService,
        ConfigurationsProductsService,
        ConfigurationsDealersService,
        ConfigurationsProductTypesService,
        ConfigurationsPromotionsService,
        AuthenticationGuard
    ],
    entryComponents: [
        
    ]
})
export class ConfigurationsModule
{
}
