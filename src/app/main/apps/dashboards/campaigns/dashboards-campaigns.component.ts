import { OnInit, OnDestroy, ViewEncapsulation, Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { DashboardsCampaignsService } from './dashboards-campaigns.service';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { ConsumersService } from '../../consumers/consumers.service';

import { MatTabGroup, MatTabChangeEvent, PageEvent, MatSort, MatPaginator, MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatCheckbox, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import { EnrollmentUploadDialogComponent } from './enrollment-upload/enrollment-upload.component';
import { QRDialogComponent } from './qr-dialog/qr-dialog.component';
import { ConfigurationsProductsService } from 'app/main/configurations/products/products.service';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';
import { ConfigurationsDealersService } from 'app/main/configurations/dealers/dealers.service';
import { CampaignsService } from '../../campaigns/campaigns.service';
import { CreateCampaignsService } from '../../create-campaigns/create-campaigns.service';


@Component({
    selector     : 'dashboards-campaigns',
    templateUrl  : './dashboards-campaigns.component.html',
    styleUrls    : ['./dashboards-campaigns.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class DashboardsCampaignsComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any>;

    // main
    campaigns: any[];
    selectedCampaign: any;
    firstName: string;
    dialogRef: any;
    form: FormGroup;
    products: any[];
    disableSelect = new FormControl(false);
    campaignTypeId: number;
    collectingType: number;
    setRows: number;
    setColumns: number;
    collectingData: any[];
    dealerList: [];
    dealers: [];
    
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    @ViewChild(MatTabGroup, {static: true}) tabGroup: MatTabGroup;
    index = 0;

    // chart
    transactionChart: [];
    qrCodeChart: [];
    provinceChart: [];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Used status';
    xAxisLabelQr = 'Type';
    xAxisLabelProvinces = 'Provinces';
    showYAxisLabel = true;
    yAxisLabel = 'Transaction';
    yAxisLabelQr = 'Code';
    colorScheme = {
        domain: ['#0296D3', '#028728', '#D1C402', '#FCD06B', '#D27900']
    };
    provinceColorScheme = {
        domain: ['#A52A2A',
        '#DC143C',
        '#FF0000',
        '#F08080',
        '#E9967A',
        '#FFA07A',
        '#FF4500',
        '#FF8C00',
        '#FFD700',
        '#DAA520',
        '#EEE8AA',
        '#BDB76B',
        '#F0E68C',
        '#808000',
        '#FFFF00',
        '#9ACD32',
        '#556B2F',
        '#6B8E23',
        '#ADFF2F',
        '#006400',
        '#00FF00',
        '#32CD32',
        '#8FBC8F',
        '#00FA9A',
        '#2E8B57',
        '#66CDAA',
        '#3CB371',
        '#20B2AA',
        '#2F4F4F',
        '#008B8B',
        '#00FFFF',
        '#E0FFFF',
        '#00CED1',
        '#40E0D0',
        '#AFEEEE',
        '#7FFFD4',
        '#B0E0E6',
        '#5F9EA0',
        '#4682B4',
        '#6495ED',
        '#00BFFF',
        '#1E90FF',
        '#ADD8E6',
        '#191970',
        '#0000FF',
        '#4169E1',
        '#8A2BE2',
        '#4B0082',
        '#483D8B',
        '#6A5ACD',
        '#9370DB',
        '#8B008B',
        '#9400D3',
        '#BA55D3',
        '#800080',
        '#D8BFD8',
        '#DDA0DD',
        '#EE82EE',
        '#FF00FF',
        '#DA70D6',
        '#C71585',
        '#DB7093',
        '#FF1493',
        '#FF69B4',
        '#FFB6C1',
        '#FFC0CB',
        '#FAEBD7',
        '#FFE4C4',
        '#FFEBCD',
        '#F5DEB3',
        '#FFF8DC',
        '#8B4513',
        '#A0522D',
        '#D2691E',
        '#CD853F',
        '#F4A460',
        '#DEB887',
        '#D2B48C',
        '#BC8F8F',
        '#FFE4B5',
        '#FFDAB9',
        '#FFE4E1',
        '#FFF0F5',
        '#FAF0E6',
        '#FDF5E6',
        '#FFEFD5',
        '#FFF5EE',
        '#F5FFFA',
        '#708090',
        '#B0C4DE',
        '#E6E6FA',
        '#FFFAF0',
        '#F0F8FF',
        '#F8F8FF',
        '#F0FFF0',
        '#FFFFF0',
        '#F0FFFF',
        '#FFFAFA'
    ]
    };

     // options
    view: any[] = [700, 400];
    usageSummaryColorScheme = {
        domain: ['#0296D3', '#F99309', '#AFADAA']
    };
    showLabels = false;
    isDoughnut = true;
    legendPosition = 'right';
    // table
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource: any;
    dataSourceEnrollment: any;
    dataSourceTransaction: any;
    pageEvent: PageEvent;
    length = 0;
    pageIndex = 0;
    pageSize = 5;
    previousPageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    sortActive: string;
    sortDirection: string;
    transactionDisplayedColumns = [ 'fullName', 'email', 'phone', 'token', 'code', 'point', 'status',  'message', 'createDate'];
    qrCodeDisplayedColumns = ['token', 'peice', 'code', 'point', 'fullName', 'email',  'phone', 'createDate', 'actions'];
    enrollmentDisplayedColumns = ['checkbox', 'firstName', 'lastName' , 'phone',  'email'];
    searchInput: FormControl;
    searchText: string;

    selection = new SelectionModel<any>(true, []);
    selectionAmount = 0;
    smsChecked: boolean;
    emailChecked: boolean;
    channel: string;
    @ViewChild('allCheckBox', {static: false}) 
    allCheckBox: MatCheckbox;
    campaignId: any;

    campaignDetail: any[];
    maps: any[];

    constructor(
        private _router: Router,
        private _dashboardsCampaignsService: DashboardsCampaignsService,
        private _authenticationService: AuthenticationService,
        private _consumersService: ConsumersService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _configurationsProductsService: ConfigurationsProductsService,
        private datePipe: DatePipe,
        private _createCampaignsService: CreateCampaignsService,
        private _configurationsDealersService: ConfigurationsDealersService,
        private route: ActivatedRoute
    )
    {
        this._unsubscribeAll = new  Subject();
        
        this.campaigns = this._dashboardsCampaignsService.campaigns.filter(x => x.campaignStatusId === 2);
        this.firstName = this._authenticationService.getRawAccessToken('firstName');
        // this.campaignId = this.route.snapshot.paramMap.get('id');

        // this._dashboardsCampaignsService.getCampaignDetail(this.campaignId).then(response => {
        //     if (response.isSuccess)
        //     {
        //         this.selectedCampaign = response.campaign;
        //         this.campaignTypeId = this.selectedCampaign.campaignTypeId;
        //     }else{
        //         this._router.navigate(['apps/campaigns']);
        //     }
        // });
        // this.getCampaignDetail(this.campaignId);
        // this.getCharts();

        // if (this.campaigns && this.campaigns.length > 0)
        // {
        //     this.selectedCampaign = this.campaigns[0];
        //     this.campaignTypeId = this.selectedCampaign.campaignTypeId;
        //     this.getCharts();
        // }
        // else
        // {
        //     //this._router.navigate(['apps/campaigns']);
        // }

        this._configurationsDealersService.getDealers().then(response => {
            if (response.isSuccess) {
                this.dealerList = response.dealers;
            }
        });

        this.searchInput = new FormControl('');
        this.dataSource = [];
        this.dataSourceEnrollment = [];
        this.form = this._formBuilder.group({
            name : [''],
            waste: [0],
            description : [''],
            product: [''],
            startDate : [''],
            endDate : [''],
            alertMessage : [''],
            duplicateMessage : [''],
            qrCodeNotExistMessage : [''],
            winMessage : [''],
            dealers: [undefined],
            tel: [''],
            facebook : [''],
            line: [''],
            web : [''],

        }); 
    }

    ngOnInit(): void 
    {
        this._unsubscribeAll = new Subject();

        this._dashboardsCampaignsService.onSelectedCampaignChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
            // console.log(response.campaign)
            this.selectedCampaign = response.campaign;
            this.campaignId = this.selectedCampaign.id;
            //this.selectedCampaignChanged(response.campaign);
            this.getCharts();
            
        });

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

        this._configurationsProductsService.getProducts().then(res => {
            if (res.isSuccess){
                this.products = res.products;
            }
        });
    }

    ngOnDestroy(): void 
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    selectedCampaignChanged(campaign): void
    {
        this.campaignId = campaign.id;
        this.tabGroup.selectedIndex = 0;
        this.index = 0;
        this.selectedCampaign = campaign;
        
        this.campaignTypeId = this.selectedCampaign.campaignTypeId;

        this.getCharts();
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void
    {
        this.campaignTypeId = this.selectedCampaign.campaignTypeId;
        // this.dataSource = [];
        this.index = tabChangeEvent.index;
        switch (this.index){
            case 0:
                {
                    this.getCharts();
                    break;
                }
            case 1:
                {
                    this.getCampaignDetail(this.campaignId);
                    break;
                }
            case 2:
                {
                    this.getTransactions();
                    break;
                }
            case 3:
                {
                    this.getQrCodes();
                    break;
                }
            case 4:
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
        this._dashboardsCampaignsService.chartTransaction(this.campaignId).then(response => {
            if (response.isSuccess)
            {
                this.transactionChart = response.charts;
            }
        }, error => {

        });

        this._dashboardsCampaignsService.chartQrCode(this.campaignId).then(response => {
            if (response.isSuccess)
            {
                this.qrCodeChart = response.charts;
            }
        }, error => {

        });
        this.provinceChart = [];
        this._dashboardsCampaignsService.charProvince(this.campaignId).then(response => {
            if (response.isSuccess)
            {
                const orderByDescCharts = response.charts.slice(0);
                orderByDescCharts.sort(function(a,b) {
                        return b.value - a.value;
                    });
                this.provinceChart = orderByDescCharts;

                const orderByDescProvince = response.markerProvinces.slice(0);
                orderByDescProvince.sort(function(a,b) {
                        return b.total - a.total;
                    });
                this.maps = orderByDescProvince;
            }
        }, error => {

        });
    }

    getCampaignDetail(campaignId: number): void
    {
         this._dashboardsCampaignsService.getCampaignDetail(campaignId).then(response => {
            if (response.isSuccess)
            {
                
                this.campaignDetail = response.campaign;
                this.campaignTypeId = this.campaignDetail['campaignTypeId'];
                if (this.campaignTypeId === 1){
                    this.collectingType = this.campaignDetail['collectingType'];
                    this.setRows = this.campaignDetail['rows'];
                    this.setColumns = this.campaignDetail['columns'];
                    this.collectingData = this.campaignDetail['collectingData'];
                    this.dealers = this.campaignDetail['dealers'];
                }
                this.form = this._formBuilder.group({
                    name : [this.campaignDetail['name']],
                    waste : [this.campaignDetail['waste']],
                    description : [this.campaignDetail['description']],
                    product: [{value: this.campaignDetail['product'], disabled: true}],
                    startDate : [this.datePipe.transform(this.campaignDetail['startDate'], 'yyyy-MM-dd')],
                    endDate : [this.datePipe.transform(this.campaignDetail['endDate'], 'yyyy-MM-dd')],
                    alertMessage : [this.campaignDetail['alertMessage']],
                    duplicateMessage : [this.campaignDetail['duplicateMessage']],
                    qrCodeNotExistMessage : [this.campaignDetail['qrCodeNotExistMessage']],
                    winMessage : [this.campaignDetail['winMessage']],
                    dealers: [undefined],
                    tel: [this.campaignDetail['tel']],
                    facebook : [this.campaignDetail['facebook']],
                    line: [this.campaignDetail['line']],
                    web : [this.campaignDetail['web']],
                });
                let dealers = [];
                this.campaignDetail['dealers'].forEach(element => {
                    dealers.push(element.id);
                });
                this.form.controls['dealers'].setValue(dealers); 
            }
        }, error => {

         });
    }

    getTableDataSource(): void
    {
        switch (this.index){
            case 1: {
                this.getCampaignDetail(this.campaignId);
                break;
            }
            case 2: {
                this.getTransactions();
                break;
            }
            case 3: {
                this.getQrCodes();
                break;
            }
            case 4: {
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
            this.dataSourceTransaction = response.data;
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
        this.selection.clear();
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
            this.dataSourceEnrollment  = response.data;
            this.length = response.length;
            this.paginator.length = response.length;
            this.paginator.pageIndex = this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex;
            this.paginator.pageSize = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;
            if (this.length <= ( requestData.pageIndex * requestData.pageSize)){
                this.paginator.length = response.length;
                this.paginator.pageIndex = 0;
                this.paginator.pageSize  = requestData.pageSize;
            }
            this.allCheckBox.checked = false;
        });
    }

    generateQrCode(data): void
    {
        this.dialogRef = this._matDialog.open(QRDialogComponent, {
            panelClass: 'qr-dialog',
            data      : {
                data
            }
        });

    }

    uploadEnrollmentsDialog(): void
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

    isAllSelected(): any 
    {
        const numSelected = this.selection.selected.length;
        const page = this.dataSourceEnrollment.length;

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
          this.selection.select(this.dataSourceEnrollment[index]);
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

        if (this.smsChecked && this.emailChecked)
        {
            this.channel = 'All';
        }
        else if (this.smsChecked)
        {
            this.channel = 'SMS';
        }
        else
        {
            this.channel = 'Email';
        }

        this._dashboardsCampaignsService.sendSelected(this.selection.selected, this.channel, this.selectedCampaign.id).then(res => {
            if (res.isSuccess === false)
            {
                this._snackBar.open(res.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['error-snackbar']
                });
            }
            else
            {
                this._snackBar.open('Send data successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
                this.allCheckBox.checked = false;
                this.selection.clear();
            }
        });
    }

    sendAll(): void
    {
        const data = {
            campaignId: this.selectedCampaign.id,
            filter: this.searchText
        };

        if (this.smsChecked && this.emailChecked)
        {
            this.channel = 'All';
        }
        else if (this.smsChecked)
        {
            this.channel = 'SMS';
        }
        else
        {
            this.channel = 'Email';
        }
        this._dashboardsCampaignsService.sendAll(data, this.channel, this.selectedCampaign.id).then(res => {
            if (res.isSuccess === false)
            {
                this._snackBar.open(res.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['error-snackbar']
                });
            }
            else
            {
                this._snackBar.open('Send data successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
                this.allCheckBox.checked = false;
                this.selection.clear();
            }
        });
    }

    createCampaign(): void
    {
        let data = {
            Id: this.selectedCampaign.id,
            Name: this.form.value.name,
            Description: this.form.value.description,
            StartDate:  moment(this.form.value.startDate).format('YYYY-MM-DD'),
            EndDate:  moment(this.form.value.endDate).format('YYYY-MM-DD'),
            AlertMessage: this.form.value.alertMessage,
            DuplicateMessage: this.form.value.duplicateMessage,
            QrCodeNotExistMessage: this.form.value.qrCodeNotExistMessage,
            WinMessage: this.form.value.winMessage,
            tel: this.form.value.tel === '' ? null : this.form.value.tel,
            facebook: this.form.value.facebook === '' ? null : this.form.value.facebook,
            line: this.form.value.line === '' ? null : this.form.value.line,
            web: this.form.value.web === '' ? null : this.form.value.web,
       };
        this._createCampaignsService.updateCampaign(data).then(response => {
            if (response.isSuccess === false){
                this._snackBar.open(response.message, 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['error-snackbar']
                });
            }else{
                this._snackBar.open('Update capmaign successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
                //this.selectedCampaignChanged(this.selectedCampaign);
            }
        });
    }

    downloadConsumer(){

        //console.log(this.campaignTypeId);
        this._dashboardsCampaignsService.downloadConsumer(this.selectedCampaign.id, this.campaignTypeId).subscribe(response => {
            const newBlob = new Blob([response], {type: 'text/plain'});

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                //dialogRef.close();
                return;
            }

            const data = window.URL.createObjectURL(newBlob);
            const link = document.createElement('a');
            link.href = data;
            link.download = 'consummers.txt';

            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            //dialogRef.close();

            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
                //dialogRef.close();
            }, 100);
            
        }, error => {
            this._snackBar.open('Error : ' + error, 'Close', {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
            });
           // dialogRef.close();
        });
    }

}
