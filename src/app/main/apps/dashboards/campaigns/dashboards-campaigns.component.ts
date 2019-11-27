import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';

import { fuseAnimations } from '@fuse/animations';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { DashboardsCampaignsService } from './dashboards-campaigns.service';
import { MatTabChangeEvent, PageEvent, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
    selector     : 'dashboards-campaigns',
    templateUrl  : './dashboards-campaigns.component.html',
    styleUrls    : ['./dashboards-campaigns.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DashboardsCampaignsComponent implements OnInit
{
    campaigns: any[];
    selectedCampaign: any;
    index = 0;

    firstName: string;

    widgets: any;
    widget5 = {
        chartType: 'line',
        datasets : {
            yesterday: [
                {
                    label: 'Visitors',
                    data : [190, 300, 340, 220, 290, 390, 250, 380, 410, 380, 320, 290],
                    fill : 'start'

                },
                {
                    label: 'Page views',
                    data : [2200, 2900, 3900, 2500, 3800, 3200, 2900, 1900, 3000, 3400, 4100, 3800],
                    fill : 'start'
                }
            ],
            today    : [
                {
                    label: 'Visitors',
                    data : [410, 380, 320, 290, 190, 390, 250, 380, 300, 340, 220, 290],
                    fill : 'start'
                },
                {
                    label: 'Page Views',
                    data : [3000, 3400, 4100, 3800, 2200, 3200, 2900, 1900, 2900, 3900, 2500, 3800],
                    fill : 'start'

                }
            ]
        },
        labels   : ['12am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
        colors   : [
            {
                borderColor              : '#008000',
                backgroundColor          : '#008000',
                pointBackgroundColor     : '#008000',
                pointHoverBackgroundColor: '#008000',
                pointBorderColor         : '#ffffff',
                pointHoverBorderColor    : '#ffffff'
            },
            {
                borderColor              : '#99cc99',
                backgroundColor          : '#99cc99',
                pointBackgroundColor     : '#99cc99',
                pointHoverBackgroundColor: '#99cc99',
                pointBorderColor         : '#ffffff',
                pointHoverBorderColor    : '#ffffff'
            }
        ],
        options  : {
            spanGaps           : false,
            legend             : {
                display: false
            },
            maintainAspectRatio: false,
            tooltips           : {
                position : 'nearest',
                mode     : 'index',
                intersect: false
            },
            layout             : {
                padding: {
                    left : 24,
                    right: 32
                }
            },
            elements           : {
                point: {
                    radius          : 4,
                    borderWidth     : 2,
                    hoverRadius     : 4,
                    hoverBorderWidth: 2
                }
            },
            scales             : {
                xAxes: [
                    {
                        gridLines: {
                            display: false
                        },
                        ticks    : {
                            fontColor: 'rgba(0,0,0,0.54)'
                        }
                    }
                ],
                yAxes: [
                    {
                        gridLines: {
                            tickMarkLength: 16
                        },
                        ticks    : {
                            stepSize: 1000
                        }
                    }
                ]
            },
            plugins            : {
                filler: {
                    propagate: false
                }
            }
        }
    };

    mapStyle = [
        {
            'featureType': 'administrative',
            'elementType': 'labels.text.fill',
            'stylers'    : [
                {
                    'color': '#444444'
                }
            ]
        },
        {
            'featureType': 'landscape',
            'elementType': 'all',
            'stylers'    : [
                {
                    'color': '#f2f2f2'
                }
            ]
        },
        {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers'    : [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'all',
            'stylers'    : [
                {
                    'saturation': -100
                },
                {
                    'lightness': 45
                }
            ]
        },
        {
            'featureType': 'road.highway',
            'elementType': 'all',
            'stylers'    : [
                {
                    'visibility': 'simplified'
                }
            ]
        },
        {
            'featureType': 'road.arterial',
            'elementType': 'labels.icon',
            'stylers'    : [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'transit',
            'elementType': 'all',
            'stylers'    : [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'water',
            'elementType': 'all',
            'stylers'    : [
                {
                    'color': '#039be5'
                },
                {
                    'visibility': 'on'
                }
            ]
        }
    ];

    widget5SelectedDay = 'today';

    dateNow = Date.now();

    // Transaction
    tranDataSource: any;
    tranPageEvent: PageEvent;
    tranLength = 0;
    tranPageIndex = 0;
    tranPageSize = 5;
    tranPreviousPageIndex = 0;
    tranPageSizeOptions: number[] = [5, 10, 25, 100];
    tranSortActive: string;
    tranSortDirection: string;
    tranSearchInput: FormControl;
    tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token',  'point', 'status',  'message', 'createDate'];
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    // qrCode
    qrDataSource: any;
    qrPageEvent: PageEvent;
    qrLength = 0;
    qrPageIndex = 0;
    qrPageSize = 5;
    qrPreviousPageIndex = 0;
    qrPageSizeOptions: number[] = [5, 10, 25, 100];
    qrSortActive: string;
    qrSortDirection: string;
    qrSearchInput: FormControl;
    qrDisplayed = ['token', 'peice', 'point', 'fullName', 'email',  'phone', 'createDate'];


    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {CampaignService} _campaignService
     * @param {DashboardsCampaignsService} _dashboardsCampaignsService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _dashboardsCampaignsService: DashboardsCampaignsService,
        private _authenticationService: AuthenticationService
    )
    {
        this.tranSearchInput = new FormControl(''); 
        this.firstName = this._authenticationService.getRawAccessToken('firstName');
        this.campaigns = this._dashboardsCampaignsService.campaigns;
        if (this.campaigns && this.campaigns.length > 0)
        {
            this.selectedCampaign = this.campaigns[0];
            this.getCampaignSummaryById();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.widgets = this._dashboardsCampaignsService.widgets;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register a custom plugin
     */
    private _registerCustomChartJSPlugin(): void
    {
        (window as any).Chart.plugins.register({
            afterDatasetsDraw: function(chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                )
                {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function(dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if ( !meta.hidden )
                    {
                        meta.data.forEach(function(element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void
    {
        this.index = tabChangeEvent.index;
        if (this.index === 0) 
        {

        }
        else if (this.index === 1) 
        {

        }
        else if (this.index === 2)
        {

        }
        else if (this.index === 3) // Transaction
        {
            this.GetTransactions();
        }
        else if (this.index === 4) // qrcode
        {
            this.Getqrcode();
        }
    }

    public GetTransactions(): void{
        // const dialogRef: MatDialogRef<ProgressSpinnerDialogComponent> = this._matDialog.open(ProgressSpinnerDialogComponent, {
        //     panelClass: 'transparent',
        //     disableClose: true
        //   });
        const data = {
            sortActive: this.sort.active ? this.sort.active : null,
            sortDirection: this.sort['_direction'] ? this.sort['_direction'] : null,
            length: this.tranPageEvent ? this.tranPageEvent.length : 0,
            pageIndex: this.tranPageEvent ? this.tranPageEvent.pageIndex : this.tranPageIndex,
            pageSize: this.tranPageEvent ? this.tranPageEvent.pageSize : this.tranPageSize,
            previousPageIndex: this.tranPageEvent ? this.tranPageEvent.previousPageIndex : this.tranPreviousPageIndex,
            campaignId: this.selectedCampaign.id,
            //filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
        };
        this._dashboardsCampaignsService.getTransactionByCampaignId(data).then(res => {
            this.tranDataSource  = res.data;
            this.tranLength = res.length;
            this.paginator.length = res.length;
            this.paginator.pageIndex = this.tranPageEvent ? this.tranPageEvent.pageIndex : this.tranPageIndex;
            this.paginator.pageSize = this.tranPageEvent ? this.tranPageEvent.pageSize : this.tranPageSize;
            if (this.tranLength <= ( data.pageIndex * data.pageSize)){
                this.paginator.length = res.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = data.pageSize;
            }
           // dialogRef.close();
        });
    }

    public Getqrcode(): void{
        // const dialogRef: MatDialogRef<ProgressSpinnerDialogComponent> = this._matDialog.open(ProgressSpinnerDialogComponent, {
        //     panelClass: 'transparent',
        //     disableClose: true
        //   });
        const data = {
            sortActive: this.sort.active ? this.sort.active : null,
            sortDirection: this.sort['_direction'] ? this.sort['_direction'] : null,
            length: this.tranPageEvent ? this.tranPageEvent.length : 0,
            pageIndex: this.tranPageEvent ? this.tranPageEvent.pageIndex : this.tranPageIndex,
            pageSize: this.tranPageEvent ? this.tranPageEvent.pageSize : this.tranPageSize,
            previousPageIndex: this.tranPageEvent ? this.tranPageEvent.previousPageIndex : this.tranPreviousPageIndex,
            campaignId: this.selectedCampaign.id,
            //filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
        };
        this._dashboardsCampaignsService.getQrCodeByCampaignId(data).then(res => {
            this.tranDataSource  = res.data;
            this.tranLength = res.length;
            this.paginator.length = res.length;
            this.paginator.pageIndex = this.tranPageEvent ? this.tranPageEvent.pageIndex : this.tranPageIndex;
            this.paginator.pageSize = this.tranPageEvent ? this.tranPageEvent.pageSize : this.tranPageSize;
            if (this.tranLength <= ( data.pageIndex * data.pageSize)){
                this.paginator.length = res.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = data.pageSize;
            }
           // dialogRef.close();
        });
    }
    selectedCampaignChanged(campaign): void
    {
        // this.tabGroup.selectedIndex = 0;
        this.index = 0;
        this.selectedCampaign = campaign;
        this.getCampaignSummaryById();
    } 

    getCampaignSummaryById(): void
    {
        this._dashboardsCampaignsService.getCampaignSummaryById(this.selectedCampaign.id).then(response => {

        }, error => {

        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param _widget11
     */
    constructor(private _widget11)
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._widget11.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}

