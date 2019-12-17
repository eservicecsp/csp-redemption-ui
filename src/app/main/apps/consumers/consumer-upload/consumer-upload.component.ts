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

@Component({
    selector     : 'configurations-consumer-upload',
    templateUrl  : './consumer-upload.component.html',
    styleUrls    : ['./consumer-upload.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ConsumerUploadDialogComponent implements OnInit, OnDestroy
{
    // Private
    private _unsubscribeAll: Subject<any>;

    dialogTitle: string;
    allowedMimeType: string[];

    action: string;

    uploader: FileUploader;
    uploaderOption: FileUploaderOptions;
    hasBaseDropZoneOver: boolean;
    hasAnotherDropZoneOver: boolean;
    response: string;
    uploadForm: FormGroup;
    
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        public matDialogRef: MatDialogRef<ConsumerUploadDialogComponent>,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public _matDialog: MatDialog,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.dialogTitle = 'Upload consumer file';
        this.uploadForm = this.createUploadForm();
        this.uploadForm.valueChanges.subscribe(value => {
            //console.log(value);
        });

        this.allowedMimeType = ['text/plain'];

        this.uploader = new FileUploader(
            {
                url: environment.apiBaseUrl + 'consumers/upload',
                method: 'POST',
                allowedMimeType: this.allowedMimeType
                // headers: [{name: 'Content-Type', value: 'multipart/form-data; charset=utf-8'}]
            });
        this.uploader = new FileUploader({
            headers: [{ name: 'x-ms-blob-type', value : 'BlockBlob' }, {name: 'Content-Type', value: 'application/x-www-form-urlencoded; charset=utf-8'} ],
            url: environment.apiBaseUrl + '/consumers/upload',
            disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
            formatDataFunctionIsAsync: true,
            formatDataFunction: async (item) => {
                return new Promise( (resolve, reject) => {
                    resolve({
                        name: item._file.name,
                        length: item._file.size,
                        contentType: item._file.type,
                        date: new Date()
                    });
                });
            }
        });

        this.hasBaseDropZoneOver = false;
        this.hasAnotherDropZoneOver = false;
    
        this.response = '';
    
        this.uploader.response.subscribe( res => this.response = res );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

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

    createUploadForm(): FormGroup
    {
        return this._formBuilder.group({
            file      : [null],
            fileName  : [null, Validators.required],
        });
    }
    getControl(key: string): FormControl {
        return this.uploadForm.controls[key] as FormControl;
    }
    
    onSelectFile(event): void {
        // const dialogRef: MatDialogRef<ProgressSpinnerDialogComponent> = this._matDialog.open(ProgressSpinnerDialogComponent, {
        //     panelClass: 'transparent',
        //     disableClose: true
        //   });
        if (event.target.files && event.target.files[0]) {

            const filesAmount = event.target.files.length;
            const control = this.uploadForm.get('file') as FormArray;
            const controlName = this.uploadForm.get('fileName') as FormArray;

            for (let i = 0; i < filesAmount; i++) {
                const reader = new FileReader();

                reader.onload = (_event: any) => {
                    control.setValue(_event.target.result);
                };

                reader.readAsDataURL(event.target.files[i]);
            }
            controlName.setValue(event.target.files[0].name);
        }
        //dialogRef.close();
    }

    clearAttachFile(): void {
        const control = this.uploadForm.get('file') as FormArray;
        const controlname = this.uploadForm.get('fileName') as FormArray;
        control.setValue(null);
        controlname.setValue(null);
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
