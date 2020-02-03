import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { DasboardGraphService } from './graph.service';
import * as moment from 'moment';
import * as shape from 'd3-shape';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';
@Component({
    selector     : 'dashboards-graph',
    templateUrl  : './graph.component.html',
    styleUrls    : ['./graph.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class DashboardsGraphComponent implements OnInit
{
    graphData: any[];
    selectedData: any[];
    view: any[] = [700, 400];

    // options
    showXAxis: boolean = true;
    showYAxis: boolean = true;
    gradient: boolean = false;
    showLegend: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Status';
    //xAxisLabel: string = 'Status';
    showYAxisLabel: boolean = true;
    yAxisLabel: string = 'Transactions';
    animations: boolean = true;
    //curve = shape.curveCardinal;
    curve = shape.curveMonotoneX;
    tooltipDisabled = true;

    displayedColumns = ['total', 'unused', 'success', 'notSuccess'];


    @Output() activate: EventEmitter<any> = new EventEmitter();
    @Output() deactivate: EventEmitter<any> = new EventEmitter();


    colorScheme = {
      domain: ['#0B3EFB', '#00A20A', '#B702FA', '#F8A407', '#FA2802', '#02FAE8', '#FA029C']
    };

    searchForm: FormGroup;

    constructor(
        private _dasboardGraphService: DasboardGraphService,
        private _formBuilder: FormBuilder,
    )
    {
        this.searchForm = this._formBuilder.group({
            startDate: null,
            endDate: null,
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
       
        this.getDataGraph();
    }

    onSelect(event): void {

        
        this.graphData.forEach( (item, index) => {
            if (item.name === event) { 
                
             }
          });
    }
    onActivate(event): void {
        this.selectedData = null;
        this.graphData.forEach( (item, index) => {
           // console.log(item);
            if (item.name === event.value.name) { 
                //this.selectedData = item.series;
                this.selectedData = [
                    {
                        total : item.series[0].value,
                        unused : item.series[1].value,
                        success : item.series[2].value,
                        notSuccess : item.series[3].value,
                    }
                ];
             }
          });
    }
    onDeactivate(item): void {
        this.selectedData = null;
    }
    // onActivate(item) {
    
    //     const idx = this.graphData.findIndex(d => {
    //       return d.name === item.name && d.value === item.value;
    //     });
    //     if (idx > -1) {
    //       return;
    //     }
    
    //     this.graphData = [item];
    //     this.activate.emit({ value: item, entries: this.graphData });
    // }
    // onDeactivate(item) {
    //     const idx = this.graphData.findIndex(d => {
    //       return d.name === item.name && d.value === item.value;
    //     });
    
    //     this.graphData.splice(idx, 1);
    //     this.graphData = [...this.graphData];
    
    //     this.deactivate.emit({ value: item, entries: this.graphData });
    //   }
    
    //   deactivateAll() {
    //     this.graphData = [...this.graphData];
    //     for (const entry of this.graphData) {
    //       this.deactivate.emit({ value: entry, entries: [] });
    //     }
    //     this.graphData = [];
    //   }
    //   onClick(data, series?): void {
    //     if (series) {
    //       data.series = series.name;
    //     }
    
    //     //this.select.emit(data);
    //   }
    addEvent(type: string, event: MatDatepickerInputEvent<Date>): void 
    {
        //console.log(`${type}: ${event.value}`);
        this.getDataGraph();
    }

    getDataGraph(): void
    {
        let startDate = null;
        let endDate = null;

        if (this.searchForm.value.startDate != null){
            startDate =  moment(this.searchForm.value.startDate).format('YYYY-MM-DD');
        }
        
        if (this.searchForm.value.endDate != null){
            endDate =  moment(this.searchForm.value.endDate).format('YYYY-MM-DD');
        }

        const data = {
            startDate: startDate,
            endDate: endDate,
        };

        this._dasboardGraphService.GetGraph(data).then(response => {
            if (response.isSuccess){
                this.graphData = response.graphs;
            }
        });
    }


}

