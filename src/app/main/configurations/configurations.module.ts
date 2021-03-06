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

import { MatProgressBarModule, MatToolbarModule, MatDialogModule, MatTooltipModule, MatProgressSpinnerModule, MatSlideToggleModule, MatDatepickerModule } from '@angular/material';
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
import { PromotionDetailComponent } from './promotions/promotion-detail/promotion-detail.component';
import { ConfigurationsPromotionTypesComponent } from './promotion-types/promotion-types.component';
import { ConfigurationsPromotionTypesService } from './promotion-types/promotion-types.service';
import { PromotionTypeDetailComponent } from './promotion-types/promotion-type-detail/promotion-type-detail.component';
import { ConfigurationsBrandsComponent } from './brands/brands.component';
import { ConfigurationsBrandsService } from './brands/brands.service';
import { BrandDetailComponent } from './brands/brand-detail/brand-detail.component';
import { ConfigurationsRolesComponent } from './roles/roles.component';
import { ConfigurationsRolesService } from './roles/roles.service';
import { RoleDetailComponent } from './roles/role-detail/role-detail.component';
import { ConfigurationsContactUsComponent } from './contact-us/contact-us.component';
import { ConfigurationsContactUsService } from './contact-us/contact-us.service';


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
    {
        path     : 'promotions/:id',
        component: PromotionDetailComponent,
        resolve  : {
            data: ConfigurationsProductsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'promotion-types',
        component: ConfigurationsPromotionTypesComponent,
        resolve  : {
            data: ConfigurationsPromotionTypesService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'promotion-types/:id',
        component: PromotionTypeDetailComponent,
        resolve  : {
            data: ConfigurationsPromotionTypesService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'brands',
        component: ConfigurationsBrandsComponent,
        resolve  : {
            data: ConfigurationsBrandsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'brands/:id',
        component: BrandDetailComponent,
        resolve  : {
            data: ConfigurationsBrandsService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'roles',
        component: ConfigurationsRolesComponent,
        resolve  : {
            data: ConfigurationsRolesService
        },
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'roles/:id',
        component: RoleDetailComponent,
        canActivate: [
            AuthenticationGuard
        ]
    },
    {
        path     : 'contact-us',
        component: ConfigurationsContactUsComponent,
        // resolve  : {
        //     data: ConfigurationsRolesService
        // },
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
        ConfigurationsPromotionTypesComponent,
        ConfigurationsBrandsComponent,
        ConfigurationsRolesComponent,
        FormProductComponent,
        FormDealerComponent,
        FormStaffComponent,
        FormProductTypeComponent, 
        PromotionDetailComponent,
        PromotionTypeDetailComponent,
        BrandDetailComponent,
        RoleDetailComponent,
        ConfigurationsContactUsComponent

        
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
        MatDatepickerModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers   : [
        ConfigurationsStaffsService,
        ConfigurationsProductsService,
        ConfigurationsDealersService,
        ConfigurationsProductTypesService,
        ConfigurationsPromotionsService,
        ConfigurationsPromotionTypesService,
        ConfigurationsBrandsService,
        ConfigurationsRolesService,
        ConfigurationsContactUsService,

        AuthenticationGuard
    ],
    entryComponents: [
        
    ]
})
export class ConfigurationsModule
{
}
