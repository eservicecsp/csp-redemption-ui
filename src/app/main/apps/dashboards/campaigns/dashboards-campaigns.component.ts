import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as shape from 'd3-shape';

import { fuseAnimations } from '@fuse/animations';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { DashboardsCampaignsService } from './dashboards-campaigns.service';
import { MatTabChangeEvent, PageEvent, MatPaginator, MatSort, MatTabGroup, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { QRDialogComponent } from './qr-dialog/qr-dialog.component';

@Component({
    selector     : 'dashboards-campaigns',
    templateUrl  : './dashboards-campaigns.component.html',
    styleUrls    : ['./dashboards-campaigns.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DashboardsCampaignsComponent implements OnInit
{
    isVisible: boolean;
    campaigns: any[];
    selectedCampaign: any;
    index = 0;
    campaignTypeId: number;
    showCoulmnCode: boolean;
    showCoulmnPoint: boolean;
    showCoulmnEnrollment: boolean;

    firstName: string;

   

    dateNow = Date.now();

    dialogRef: any;

    // Transaction
    DataSource: any;
    tranPageEvent: PageEvent;
    tranLength = 0;
    tranPageIndex = 0;
    tranPageSize = 5;
    tranPreviousPageIndex = 0;
    tranPageSizeOptions: number[] = [5, 10, 25, 100];
    tranSortActive: string;
    tranSortDirection: string;
    searchInput: FormControl;
    tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token', 'code', 'point', 'status',  'message', 'createDate'];
    // Tab 
    @ViewChild(MatTabGroup, {static: true}) tabGroup: MatTabGroup;
    
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('qrMatSort', {static: true}) qrMatSort: MatSort;

    // @ViewChild(MatSort, {static: true})
    // qrMatSort: MatSort;
    @ViewChild('filter', {static: true})
    filter: ElementRef;

    private _unsubscribeAll: Subject<any>;
    urlValue: string;

    //qrCode
    qrDataSource: any;
    qrPageEvent: PageEvent;
    qrLength = 0;
    qrPageIndex = 0;
    qrPageSize = 5;
    qrPreviousPageIndex = 0;
    qrPageSizeOptions: number[] = [5, 10, 25, 100];
    qrSortActive: string;
    qrSortDirection: string;
    
    // qrSearchInput: FormControl;
    qrDisplayed = ['token', 'peice', 'code', 'point', 'fullName', 'email',  'phone', 'createDate', 'QrCode'];

    // // Tab 1
     resTransaction = [];
     resQrCode = [];
    // options
    // showXAxis = true;
    // showYAxis = true;
    // gradient = false;
    // showLegend = false;
    // showXAxisLabel = false;
    // xAxisLabel = 'Type';
    // showYAxisLabel = false;
    // yAxisLabel = 'Quantity';

    // colorScheme = {
    //     domain: ['#42BFF7', '#42BFF7', '#C6ECFD', '#42BFF7', '#42BFF7', '#42BFF7', '#42BFF7', '#42BFF7']
    // };
    // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Type';
  xAxisLabelQr = 'Type';
  showYAxisLabel = true;
  yAxisLabel = 'Transaction';
  yAxisLabelQr = 'Code';

//   colorScheme = {
//     domain: ['#42BFF7', '#42BFF7', '#C6ECFD', '#42BFF7', '#42BFF7']
//   };
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#42BFF7', '#42BFF7']
  };


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
        private _authenticationService: AuthenticationService,
        private _router: Router,
        public _matDialog: MatDialog,
    )
    {
        this._unsubscribeAll = new Subject();
        this.searchInput = new FormControl(''); 

        
        this.firstName = this._authenticationService.getRawAccessToken('firstName');
        this.campaigns = this._dashboardsCampaignsService.campaigns;
        //console.log(this.campaigns);
        if (this.campaigns && this.campaigns.length > 0)
        {
            this.selectedCampaign = this.campaigns[0];
            this.campaignTypeId = this.selectedCampaign.campaignTypeId;
            this.Chart();
        }else{
            window.location.href = 'apps/campaigns';
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

        this.searchInput.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            distinctUntilChanged()
        )
        .subscribe(searchText => {
            if (this.index === 1) // Transaction
            {
                this.GetTransactions();
               
            }
            else if (this.index === 2) // qrcode
            {
                this.Getqrcode();
            }
        });
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
        this.urlValue = null;
        this.isVisible = false;
        this.showCoulmnCode = false;
        this.showCoulmnPoint = false;
        this.showCoulmnEnrollment = false;
        if (this.campaignTypeId === 3){
            this.qrDisplayed = ['token', 'code', 'fullName', 'email',  'phone', 'createDate', 'QrCode'];
            this.tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token', 'code',  'status',  'message', 'createDate'];
        }
        if (this.campaignTypeId === 2){
            this.qrDisplayed = ['token',  'point', 'fullName', 'email',  'phone', 'createDate', 'QrCode'];
            this.tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token', 'point', 'status',  'message', 'createDate'];
        }
        if (this.campaignTypeId === 1){
            this.qrDisplayed = ['token', 'peice',  'fullName', 'email',  'phone', 'createDate', 'QrCode'];
            this.tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token',  'status',  'message', 'createDate'];
        }
        if (this.index === 0) 
        {
            this.Chart();
        }
        // else if (this.index === 1) 
        // {

        // }
        // else if (this.index === 2)
        // {

        // }
        else if (this.index === 1) // Transaction
        {
            this.isVisible = true;
            this.GetTransactions();
        }
        else if (this.index === 2) // qrcode
        {
            this.isVisible = true;
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
            filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
        };
        this._dashboardsCampaignsService.getTransactionByCampaignId(data).then(res => {
            this.DataSource  = res.data;
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
            sortActive: this.qrMatSort.active ? this.qrMatSort.active : null,
            sortDirection: this.qrMatSort['_direction'] ? this.qrMatSort['_direction'] : null,
            length: this.qrPageEvent ? this.qrPageEvent.length : 0,
            pageIndex: this.qrPageEvent ? this.qrPageEvent.pageIndex : this.qrPageIndex,
            pageSize: this.qrPageEvent ? this.qrPageEvent.pageSize : this.qrPageSize,
            previousPageIndex: this.qrPageEvent ? this.qrPageEvent.previousPageIndex : this.qrPreviousPageIndex,
            campaignId: this.selectedCampaign.id,
            filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
        };
        this._dashboardsCampaignsService.getQrCodeByCampaignId(data).then(res => {
            this.DataSource  = res.data;
            this.qrLength = res.length;
            this.paginator.length = res.length;
            this.paginator.pageIndex = this.qrPageEvent ? this.qrPageEvent.pageIndex : this.qrPageIndex;
            this.paginator.pageSize = this.qrPageEvent ? this.qrPageEvent.pageSize : this.qrPageSize;
            if (this.qrLength <= ( data.pageIndex * data.pageSize)){
                this.paginator.length = res.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = data.pageSize;
            }
           // dialogRef.close();
        });
    }
    selectedCampaignChanged(campaign): void
    {
        this.tabGroup.selectedIndex = 0;
        this.index = 0;
        this.selectedCampaign = campaign;
        this.campaignTypeId = this.selectedCampaign.campaignTypeId;
        
        //this.getCampaignSummaryById();
        this.Chart();
    } 

    getCampaignSummaryById(): void
    {
        this._dashboardsCampaignsService.getCampaignSummaryById(this.selectedCampaign.id).then(response => {

        }, error => {

        });
    }
    Chart(): void{
        this._dashboardsCampaignsService.chartTransaction(this.selectedCampaign.id).then(response => {
            if (response.isSuccess)
            {
                this.resTransaction = response.charts;
                console.log(this.resTransaction);
            }
        }, error => {

        });

        this._dashboardsCampaignsService.chartQrCode(this.selectedCampaign.id).then(response => {
            if (response.isSuccess)
            {
                this.resQrCode = response.charts;
                console.log(this.resQrCode);
            }
        }, error => {

        });
    }

    genQrCode(data): void
    {
        // window.location.href = data;
        this.dialogRef = this._matDialog.open(QRDialogComponent, {
            panelClass: 'qr-dialog',
            data      : {
                data
            }
        });

        // this.dialogRef.afterClosed()
        //     .subscribe(dialogResponse => {
        //         if ( !dialogResponse )
        //         {
        //             return;
        //         }
        //         const actionType: string = dialogResponse[0];
        //         switch ( actionType )
        //         {
        //             /**
        //              * Save
        //              */
        //             case 'upload':

        //                 const data = formData.getRawValue();
        //                 data.orderId = this.selectedCampaign.id;
        //                 console.log(data);
        //                 // this._monitoringCampaignService.uploadEnrollmentFile(data).then(response => {
        //                 //     if (response.isSuccess)
        //                 //     {
        //                 //         this._snackBar.open('Upload completed.', 'Close', {
        //                 //             duration: 5000,
        //                 //             horizontalPosition: this.horizontalPosition,
        //                 //             verticalPosition: this.verticalPosition,
        //                 //             panelClass: ['success-snackbar']
        //                 //         });
        //                 //         this.getEnrollments();
        //                 //     }
        //                 //     else
        //                 //     {
        //                 //         this._snackBar.open(response.message, 'Close', {
        //                 //             duration: 5000,
        //                 //             horizontalPosition: this.horizontalPosition,
        //                 //             verticalPosition: this.verticalPosition,
        //                 //             panelClass: ['error-snackbar']
        //                 //         });
        //                 //     }
        //                 // }, error => {
        //                 //     this._snackBar.open(error, 'Close', {
        //                 //         duration: 5000,
        //                 //         horizontalPosition: this.horizontalPosition,
        //                 //         verticalPosition: this.verticalPosition,
        //                 //         panelClass: ['error-snackbar']
        //                 //     });
        //                 // });

        //                 break;
        //         }
        //     });
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

