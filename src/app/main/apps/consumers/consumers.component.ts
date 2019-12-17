import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { ConsumersService } from './consumers.service';
import { takeUntil } from 'rxjs/internal/operators';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { ConsumerUploadDialogComponent } from './consumer-upload/consumer-upload.component';
import { FormControl, FormGroup } from '@angular/forms';
// import { ConfigurationsConsumerUploadComponent } from '../consumer-upload/consumer-upload.component';

@Component({
    selector     : 'consumers',
    templateUrl  : './consumers.component.html',
    styleUrls    : ['./consumers.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ConsumersComponent implements OnInit
{
    dataSource: any;
    pageEvent: PageEvent;
    length = 0;
    pageIndex = 0;
    pageSize = 5;
    previousPageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    sortActive: string;
    sortDirection: string;
    searchInput: FormControl;
    displayedColumns = ['id', 'fullName',  'birthDate', 'phone',  'email'];

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private _consumersService: ConsumersService,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.searchInput = new FormControl('');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.Mapdata();
        this.searchInput.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            distinctUntilChanged()
        )
        .subscribe(searchText => {
            this.Mapdata();
        });
        // this.dataSource = new FilesDataSource(this._consumersService, this.paginator, this.sort);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if ( !this.dataSource )
                {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    uploadDialog(): void
    {
        this.dialogRef = this._matDialog.open(ConsumerUploadDialogComponent, {
            panelClass: 'consumer-upload-dialog',
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
                         this._consumersService.uploadConsumerFile(data).then(response => {
                            if (response.isSuccess)
                            {
                                this._snackBar.open('Upload completed.', 'Close', {
                                    duration: 5000,
                                    horizontalPosition: this.horizontalPosition,
                                    verticalPosition: this.verticalPosition,
                                    panelClass: ['success-snackbar']
                                });
                                this.Mapdata();
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

    public Mapdata(): void{
        // const dialogRef: MatDialogRef<ProgressSpinnerDialogComponent> = this._matDialog.open(ProgressSpinnerDialogComponent, {
        //     panelClass: 'transparent',
        //     disableClose: true
        //   });
        const data = {
            sortActive: this.sort.active ? this.sort.active : null,
            sortDirection: this.sort['_direction'] ? this.sort['_direction'] : null,
            length: this.pageEvent ? this.pageEvent.length : 0,
            pageIndex: this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex,
            pageSize: this.pageEvent ? this.pageEvent.pageSize : this.pageSize,
            previousPageIndex: this.pageEvent ? this.pageEvent.previousPageIndex : this.previousPageIndex,
            //BrandId: 1,
            filter : this.filter.nativeElement.value ? this.filter.nativeElement.value : null
        };
        this._consumersService.getdata(data).then(res => {
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

}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {AppsConsumersService} _appsConsumersService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _consumersService: ConsumersService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._consumersService.consumers;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._consumersService.onConsumersChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._consumersService.consumers.slice();

                        data = this.filterData(data);

                        this.filteredData = [...data];

                        data = this.sortData(data);

                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    }
                ));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._matSort.active )
            {
                case 'id':
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'categories':
                    [propertyA, propertyB] = [a.categories[0], b.categories[0]];
                    break;
                case 'price':
                    [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
                    break;
                case 'quantity':
                    [propertyA, propertyB] = [a.quantity, b.quantity];
                    break;
                case 'active':
                    [propertyA, propertyB] = [a.active, b.active];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
