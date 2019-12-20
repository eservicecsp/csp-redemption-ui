import { OnInit, OnDestroy, ViewEncapsulation, Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { DashboardsCampaignsService } from './dashboards-campaigns.service';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatTabGroup, MatTabChangeEvent, PageEvent, MatSort, MatPaginator } from '@angular/material';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

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

    // main
    campaigns: any[];
    selectedCampaign: any;
    firstName: string;

    @ViewChild(MatTabGroup, {static: true}) tabGroup: MatTabGroup;
    index = 0;

    // chart
    transactionChart: [];
    qrCodeChart: [];
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

    // table
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource: any;
    pageEvent: PageEvent;
    length = 0;
    pageIndex = 0;
    pageSize = 5;
    previousPageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    sortActive: string;
    sortDirection: string;
    transactionDisplayedColumns = ['id', 'fullName', 'email', 'phone', 'token', 'code', 'point', 'status',  'message', 'createDate'];
    qrCodeDisplayedColumns = ['token', 'peice', 'code', 'point', 'fullName', 'email',  'phone', 'createDate', 'actions'];
    enrollmentDisplayedColumns = ['firstName', 'lastName' , 'phone',  'email'];
    searchInput: FormControl;
    searchText: string;

    selection = new SelectionModel<any>(true, []);
    selectionAmount = 0;

    constructor(
        private _router: Router,
        private _dashboardsCampaignsService: DashboardsCampaignsService,
        private _authenticationService: AuthenticationService,
    )
    {
        this._unsubscribeAll = new  Subject();
        
        this.campaigns = this._dashboardsCampaignsService.campaigns;
        this.firstName = this._authenticationService.getRawAccessToken('firstName');

        if (this.campaigns && this.campaigns.length > 0)
        {
            this.selectedCampaign = this.campaigns[0];
            this.getCharts();
        }
        else
        {
            this._router.navigate(['apps/campaigns']);
        }

        this.searchInput = new FormControl('');
        this.dataSource = [];
    }

    ngOnInit(): void 
    {
        this._unsubscribeAll = new Subject();

        this.searchInput.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            distinctUntilChanged()
        )
        .subscribe(_searchText => {
            this.searchText = _searchText;
            this.getTableDataSource();
        });
    }

    ngOnDestroy(): void 
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectedCampaignChanged(campaign): void
    {
        this.tabGroup.selectedIndex = 0;
        this.index = 0;
        this.selectedCampaign = campaign;

        this.getCharts();
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void
    {
        this.index = tabChangeEvent.index;
        switch (this.selectedCampaign.campaignTypeId){
            case 0:
                {
                    this.getCharts();
                    break;
                }
            case 1:
                {
                    this.getTransactions();
                    break;
                }
            case 2:
                {
                    this.getQrCodes();
                    break;
                }
            case 3:
                {
                    this.getEnrollments();
                    break;
                }
            default: 
            {
                break;
            }
        }

        this.getTableDataSource();
    }

    getCharts(): void
    {
        this._dashboardsCampaignsService.chartTransaction(this.selectedCampaign.id).then(response => {
            if (response.isSuccess)
            {
                this.transactionChart = response.charts;
            }
        }, error => {

        });

        this._dashboardsCampaignsService.chartQrCode(this.selectedCampaign.id).then(response => {
            if (response.isSuccess)
            {
                this.qrCodeChart = response.charts;
            }
        }, error => {

        });
    }

    getTableDataSource(): void
    {
        switch (this.index){
            case 1: {
                this.getTransactions();
                break;
            }
            case 2: {
                this.getQrCodes();
                break;
            }
            case 3: {
                this.getEnrollments();
                break;
            }
            default: {
                break;
            }
        }
    }

    getTransactions(): void
    {
        const requestData = {
            sortActive: this.sort.active ? this.sort.active : null,
            sortDirection: this.sort['_direction'] ? this.sort['_direction'] : null,
            length: this.pageEvent ? this.pageEvent.length : 0,
            pageIndex: this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex,
            pageSize: this.pageEvent ? this.pageEvent.pageSize : this.pageSize,
            previousPageIndex: this.pageEvent ? this.pageEvent.previousPageIndex : this.previousPageIndex,
            campaignId: this.selectedCampaign.id,
            filter : this.searchText
        };

        this._dashboardsCampaignsService.getTransactionByCampaignId(requestData).then((response: any) => {
            this.dataSource = response.data;
            this.length = response.length;
            this.paginator.length = response.length;
            this.paginator.pageIndex = this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex;
            this.paginator.pageSize = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;
            if (this.length <= ( requestData.pageIndex * requestData.pageSize))
            {
                this.paginator.length = response.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = requestData.pageSize;
            }
        });

    }

    getQrCodes(): void
    {
        const requestData = {
            sortActive: this.sort.active ? this.sort.active : null,
            sortDirection: this.sort['_direction'] ? this.sort['_direction'] : null,
            length: this.pageEvent ? this.pageEvent.length : 0,
            pageIndex: this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex,
            pageSize: this.pageEvent ? this.pageEvent.pageSize : this.pageSize,
            previousPageIndex: this.pageEvent ? this.pageEvent.previousPageIndex : this.previousPageIndex,
            campaignId: this.selectedCampaign.id,
            filter : this.searchText
        };
        this._dashboardsCampaignsService.getQrCodeByCampaignId(requestData).then((response: any) => {
            this.dataSource  = response.data;
            this.length = response.length;
            this.paginator.length = response.length;
            this.paginator.pageIndex = this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex;
            this.paginator.pageSize = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;
            if (this.length <= ( requestData.pageIndex * requestData.pageSize)){
                this.paginator.length = response.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = requestData.pageSize;
            }
        });
    }

    getEnrollments(): void
    {
        const requestData = {
            sortActive: this.sort.active ? this.sort.active : null,
            sortDirection: this.sort['_direction'] ? this.sort['_direction'] : null,
            length: this.pageEvent ? this.pageEvent.length : 0,
            pageIndex: this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex,
            pageSize: this.pageEvent ? this.pageEvent.pageSize : this.pageSize,
            previousPageIndex: this.pageEvent ? this.pageEvent.previousPageIndex : this.previousPageIndex,
            campaignId: this.selectedCampaign.id,
            filter : this.searchText
        };

        this._dashboardsCampaignsService.getEnrollment(requestData).then((response: any) => {
            this.dataSource  = response.data;
            this.length = response.length;
            this.paginator.length = response.length;
            this.paginator.pageIndex = this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex;
            this.paginator.pageSize = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;
            if (this.length <= ( requestData.pageIndex * requestData.pageSize)){
                this.paginator.length = response.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = requestData.pageSize;
            }
        });
    }

    generateQrCode(data): void
    {
        // this.dialogRef = this._matDialog.open(QRDialogComponent, {
        //     panelClass: 'qr-dialog',
        //     data      : {
        //         data
        //     }
        // });

    }

    uploadEnrollmentsDialog(): void
    {

    }

    isAllSelected(): any 
    {
        const numSelected = this.selection.selected.length;
        const page = this.dataSource.length;

        if (numSelected === page){
            return true;
        }
        else
        {
            if (numSelected - 1 === page ){
                return true;
            }
            else{
                return false;
            }
        }        
    }

    masterToggle(): void 
    {
        this.isAllSelected() ? 
        this.selection.clear() : this.selectRows();

    }

    selectRows(): void
    {
        for (let index = 0; index < this.paginator.pageSize; index++) {
          this.selection.select(this.dataSource[index]);
          this.selectionAmount = this.selection.selected.length;
        }
    }

    checkboxLabel(row?: any): string 
    {
        if (!row) 
        {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    sendSelected(): void
    {

    }

    sendAll(): void
    {

    }
}
