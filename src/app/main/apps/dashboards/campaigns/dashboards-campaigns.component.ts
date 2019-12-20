import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as shape from 'd3-shape';

import { fuseAnimations } from '@fuse/animations';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { DashboardsCampaignsService } from './dashboards-campaigns.service';
import { MatTabChangeEvent, PageEvent, MatPaginator, MatSort, MatTabGroup, MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { QRDialogComponent } from './qr-dialog/qr-dialog.component';
import { EnrollmentUploadDialogComponent } from './enrollment-upload/enrollment-upload.component';
import { ConsumersService } from '../../consumers/consumers.service';

@Component({
    selector     : 'dashboards-campaigns',
    templateUrl  : './dashboards-campaigns.component.html',
    styleUrls    : ['./dashboards-campaigns.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DashboardsCampaignsComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;

    isVisible: boolean;
    campaigns: any[];
    selectedCampaign: any;
    index = 0;
    campaignTypeId: number;
    showCoulmnCode: boolean;
    showCoulmnPoint: boolean;
    showCoulmnEnrollment: boolean;
    dataSearch: string;

    firstName: string;

   

    dateNow = Date.now();

    dialogRef: any;

    // Transaction
    dataSource: any;
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

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    @ViewChild('qrMatSort', {static: true}) qrMatSort: MatSort;

    @ViewChild('enrollmentMatSort', {static: true}) 
    enrollmentMatSort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    urlValue: string;

    // qrCode
    qrPageEvent: PageEvent;
    qrLength = 0;
    qrPageIndex = 0;
    qrPageSize = 5;
    qrPreviousPageIndex = 0;
    qrPageSizeOptions: number[] = [5, 10, 25, 100];
    qrSortActive: string;
    qrSortDirection: string;

    //enrollment
    pageEvent: PageEvent;
    length = 0;
    pageIndex = 0;
    pageSize = 5;
    previousPageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    
    // qrSearchInput: FormControl;
    qrDisplayed = ['token', 'peice', 'code', 'point', 'fullName', 'email',  'phone', 'createDate', 'actions'];
    displayedColumns = ['firstName', 'lastName' , 'phone',  'email'];

    // Tab 1
     resTransaction = [];
     resQrCode = [];
    
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

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#42BFF7', '#42BFF7']
    };


    selection = new SelectionModel<any>(true, []);
    selectionAmount: number;
    canSendSelected: boolean;
    canSendAll: boolean;
    channel: string;
    
    smsChecked: boolean;
    emailChecked: boolean;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

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
        private _snackBar: MatSnackBar,
        private _consumersService: ConsumersService,
    )
    {
        this._unsubscribeAll = new Subject();
        this.searchInput = new FormControl(''); 

        this.dataSource = [];
        
        this.firstName = this._authenticationService.getRawAccessToken('firstName');
        this.campaigns = this._dashboardsCampaignsService.campaigns;
        
        if (this.campaigns && this.campaigns.length > 0)
        {
            this.selectedCampaign = this.campaigns[0];
            this.campaignTypeId = this.selectedCampaign.campaignTypeId;
            this.Chart();
        }
        else
        {

            this._router.navigate(['apps/campaigns']);
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
            this.dataSearch = searchText;
            if (this.index === 1) // Transaction
            {
                this.getTransactions();
               
            }
            else if (this.index === 2) // qrcode
            {
                this.getqrcode();
            }
            else if (this.index === 3)// Enrollments
            {
                this.getEnrollments();
            }

        });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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
            this.qrDisplayed = ['token', 'code', 'fullName', 'email',  'phone', 'createDate', 'actions'];
            this.tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token', 'code',  'status',  'message', 'createDate'];
        }
        if (this.campaignTypeId === 2){
            this.qrDisplayed = ['token',  'point', 'fullName', 'email',  'phone', 'createDate', 'actions'];
            this.tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token', 'point', 'status',  'message', 'createDate'];
        }
        if (this.campaignTypeId === 1){
            this.qrDisplayed = ['token', 'peice',  'fullName', 'email',  'phone', 'createDate', 'actions'];
            this.tranDisplayed = ['id', 'fullName', 'email', 'phone', 'token',  'status',  'message', 'createDate'];
        }
        if (this.index === 0) 
        {
            this.Chart();
        }
        else if (this.index === 1) // Transaction
        {
            this.isVisible = true;
            this.getTransactions();
        }
        else if (this.index === 2) // qrcode
        {
            this.isVisible = true;
            this.getqrcode();
        }
        else if (this.index === 3)
        {
            this.isVisible = true;
            this.getEnrollments();
        }
    }

    getTransactions(): void
    {
        
        const data = {
            sortActive: this.sort.active ? this.sort.active : null,
            sortDirection: this.sort['_direction'] ? this.sort['_direction'] : null,
            length: this.tranPageEvent ? this.tranPageEvent.length : 0,
            pageIndex: this.tranPageEvent ? this.tranPageEvent.pageIndex : this.tranPageIndex,
            pageSize: this.tranPageEvent ? this.tranPageEvent.pageSize : this.tranPageSize,
            previousPageIndex: this.tranPageEvent ? this.tranPageEvent.previousPageIndex : this.tranPreviousPageIndex,
            campaignId: this.selectedCampaign.id,
            //filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
            filter : this.dataSearch
        };
        this._dashboardsCampaignsService.getTransactionByCampaignId(data).then((res: any) => {
            this.dataSource  = res.data;
            this.tranLength = res.length;
            this.paginator.length = res.length;
            this.paginator.pageIndex = this.tranPageEvent ? this.tranPageEvent.pageIndex : this.tranPageIndex;
            this.paginator.pageSize = this.tranPageEvent ? this.tranPageEvent.pageSize : this.tranPageSize;
            if (this.tranLength <= ( data.pageIndex * data.pageSize)){
                this.paginator.length = res.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = data.pageSize;
            }
        });
    }

    getqrcode(): void
    {
        const data = {
            sortActive: this.qrMatSort.active ? this.qrMatSort.active : null,
            sortDirection: this.qrMatSort['_direction'] ? this.qrMatSort['_direction'] : null,
            length: this.qrPageEvent ? this.qrPageEvent.length : 0,
            pageIndex: this.qrPageEvent ? this.qrPageEvent.pageIndex : this.qrPageIndex,
            pageSize: this.qrPageEvent ? this.qrPageEvent.pageSize : this.qrPageSize,
            previousPageIndex: this.qrPageEvent ? this.qrPageEvent.previousPageIndex : this.qrPreviousPageIndex,
            campaignId: this.selectedCampaign.id,
            //filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
            filter : this.dataSearch
        };
        this._dashboardsCampaignsService.getQrCodeByCampaignId(data).then(res => {
            this.dataSource  = res.data;
            this.qrLength = res.length;
            this.paginator.length = res.length;
            this.paginator.pageIndex = this.qrPageEvent ? this.qrPageEvent.pageIndex : this.qrPageIndex;
            this.paginator.pageSize = this.qrPageEvent ? this.qrPageEvent.pageSize : this.qrPageSize;
            if (this.qrLength <= ( data.pageIndex * data.pageSize)){
                this.paginator.length = res.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = data.pageSize;
            }
        });
    }

    getEnrollments(): void
    {
        console.log(this.enrollmentMatSort)
        const data = {
            sortActive: this.enrollmentMatSort.active ? this.enrollmentMatSort.active : null,
            sortDirection: this.enrollmentMatSort['_direction'] ? this.enrollmentMatSort['_direction'] : null,
            length: this.pageEvent ? this.pageEvent.length : 0,
            pageIndex: this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex,
            pageSize: this.pageEvent ? this.pageEvent.pageSize : this.pageSize,
            previousPageIndex: this.pageEvent ? this.pageEvent.previousPageIndex : this.previousPageIndex,
            campaignId: this.selectedCampaign.id,
            //filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
            filter : this.dataSearch
        };
        this._dashboardsCampaignsService.getEnrollment(data).then(res => {
            this.dataSource  = res.data;

            this.length = res.length;
            this.paginator.length = res.length;
            this.paginator.pageIndex = this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex;
            this.paginator.pageSize = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;
            if (this.length <= ( data.pageIndex * data.pageSize)){
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
            }
        }, error => {

        });

        this._dashboardsCampaignsService.chartQrCode(this.selectedCampaign.id).then(response => {
            if (response.isSuccess)
            {
                this.resQrCode = response.charts;
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

    }

    uploadDialog(): void
    {
        
        this.dialogRef = this._matDialog.open(EnrollmentUploadDialogComponent, {
            panelClass: 'enrollment-upload-dialog',
            data      : {
                // Don't send anything
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(dialogResponse => {
                if ( !dialogResponse )
                {
                    return;
                }
                const actionType: string = dialogResponse[0];
                const formData: FormGroup = dialogResponse[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'upload':
                        const data = formData.getRawValue();
                        data.campaignId = this.selectedCampaign.id;
                        this._consumersService.uploadConsumerFile(data).then(response => {
                            if (response.isSuccess)
                            {
                                this._snackBar.open('Upload completed.', 'Close', {
                                    duration: 5000,
                                    horizontalPosition: this.horizontalPosition,
                                    verticalPosition: this.verticalPosition,
                                    panelClass: ['success-snackbar']
                                });
                                this.getEnrollments();
                            }
                            else
                            {
                                this._snackBar.open(response.message, 'Close', {
                                    duration: 5000,
                                    horizontalPosition: this.horizontalPosition,
                                    verticalPosition: this.verticalPosition,
                                    panelClass: ['error-snackbar']
                                });
                            }
                        }, error => {
                            this._snackBar.open(error, 'Close', {
                                duration: 5000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                                panelClass: ['error-snackbar']
                            });
                        });

                        break;
                }
            });
    }
}


