import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { DasboardGraphService } from './graph.service';


@Component({
    selector     : 'dashboards-graph',
    templateUrl  : './graph.component.html',
    styleUrls    : ['./graph.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class DashboardsGraphComponent implements OnInit
{
    graphData: any[];
    view: any[] = [700, 400];

    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Campaigns name';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = 'Transactions';
    animations: boolean = true;
  
    colorScheme = {
      domain: ['#5AA454', '#C7B42C', '#AAAAAA']
    };
    constructor(
        private _dasboardGraphService: DasboardGraphService,
    )
    {
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._dasboardGraphService.GetGraph().then(response => {
            if (response.isSuccess){
                this.graphData = response.graphs;
                console.log(this.graphData);
            }
        });
        
    }


}

