import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'dashboards/campaigns',
        loadChildren: './dashboards/campaigns/dashboards-campaigns.module#DashboardsCampaignsModule'
    },
    {
        path        : 'campaigns',
        loadChildren: './campaigns/campaigns.module#CampaignsModule'
    },
    {
        path        : 'consumers',
        loadChildren: './consumers/consumers.module#ConsumersModule'
    },
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule
    ]
})
export class AppsModule
{
}
