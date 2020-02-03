import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
    {
        path        : 'dashboards/campaigns',
        loadChildren: './dashboards/campaigns/dashboards-campaigns.module#DashboardsCampaignsModule'
    },
    {
        path        : 'create-campaign',
        loadChildren: './create-campaigns/create-campaigns.module#CreateCampaignsModule'
    },
    {
        path        : 'consumers',
        loadChildren: './consumers/consumers.module#ConsumersModule'
    },
    {
        path        : 'campaigns',
        loadChildren: './campaigns/campaigns.module#CampaignsModule'
    },
    {
        path        : 'campaign-create',
        loadChildren: './campaign-create/campaign-create.module#CampaignCreateModule'
    },
    // {
    //     path        : 'dashboards/graph',
    //     loadChildren: './dashboards/graph/graph.module#GraphModule'
    // }
    {
        path        : 'graph',
        loadChildren: './dashboards/graph/graph.module#GraphModule'
    }
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
