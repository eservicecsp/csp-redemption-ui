import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { environment } from 'environments/environment';
import { ConsumersService } from '../consumers.service';

@Component({
    selector     : 'configurations-consumer-promotion',
    templateUrl  : './consumer-promotion.component.html',
    styleUrls    : ['./consumer-promotion.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ConsumerPromotionDialogComponent implements OnInit, OnDestroy
{
    // Private
    private _unsubscribeAll: Subject<any>;

    dialogTitle: string;
    allowedMimeType: string[];

    action: string;

    hasBaseDropZoneOver: boolean;
    hasAnotherDropZoneOver: boolean;
    response: string;
    promotionForm: FormGroup;
    promotions: any[];
    
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        public matDialogRef: MatDialogRef<ConsumerPromotionDialogComponent>,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public _matDialog: MatDialog,
        private _consumersService: ConsumersService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.dialogTitle = 'Promotion';

        this.allowedMimeType = ['text/plain'];

        this._consumersService.getPromotionvalid().then(response => {
            if (response.isSuccess){
                this.promotions = response.promotions;
            }
        });


        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
    
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.promotionForm = this._formBuilder.group({
            promotion : [null, Validators.required]
        }); 
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

   
    

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    public fileOverBase(e: any): void 
    {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void 
    {
        this.hasAnotherDropZoneOver = e;
    }
}
