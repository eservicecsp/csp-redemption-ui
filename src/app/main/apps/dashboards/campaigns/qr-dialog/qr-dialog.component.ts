import { ViewEncapsulation, Component, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
    selector     : 'qr-dialog',
    templateUrl  : './qr-dialog.component.html',
    styleUrls    : ['./qr-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class QRDialogComponent
{
    action: string;
    dialogTitle: string;
    url: string;
    /**
     * Constructor
     *
     * @param {MatDialogRef<EnrollmentUploadComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<QRDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public _matDialog: MatDialog,
    )
    {
        this.dialogTitle = 'QR Code';
        this.url = _data.data;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

}
