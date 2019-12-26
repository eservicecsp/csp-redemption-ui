import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { ConfigurationsProductsService } from '../products.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { ConfigurationsProductTypesService } from '../../product-types/product-types.service';

@Component({
    selector     : 'form-product',
    templateUrl  : './form-product.component.html',
    styleUrls    : ['./form-product.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class FormProductComponent implements OnInit
{
    productForm = this._formBuilder.group({
        id: [0],
        name   : ['', [Validators.required]],
        description: ['', Validators.required],
        productTypeId: ['', Validators.required],
        createdBy : this._authenticationService.getRawAccessToken('userId'),
        attachments: this._formBuilder.array([])
    });
    productTypes: any[];
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    pageType: string;

    productId: number;

    product: any;

    constructor(
        private _configurationsProductsService: ConfigurationsProductsService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute,
        private _configurationsProductTypesService: ConfigurationsProductTypesService
    )
    {
        this.productId = 0;
        this.product = {
            attachments: []
        };

        this.route.params.subscribe(params => {
            this.productId = params['id'];
            if (this.productId > 0){
                this.pageType = 'edit';

                this._configurationsProductsService.getProductsById(this.productId).then(response => {
                    if (response.isSuccess)
                    {
                        this.product = response.product;
                        const attachmentsFA = this.setAttachments(this.product.attachments);

                        this.productForm = this._formBuilder.group({
                            id: this.productId,
                            name   : [response.product.name, [Validators.required]],
                            productTypeId: [response.product.productTypeId , Validators.required],
                            description: [response.product.description, Validators.required],
                            attachments: attachmentsFA
                        });
                        
                    }
                });
            }
            else
            {
                this.pageType = 'new';
            }
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
        
        this._configurationsProductTypesService.getProductTypes().then(res => {
            if (res.isSuccess){
                this.productTypes = res.productTypes;
            }
        });
    }

    getControl(frmGrp: FormGroup, key: string): any {
        return (frmGrp.controls[key] as FormControl);
    }
    
    getControls(formGroup: FormGroup, fromControl: string): any{
        return (formGroup.controls[fromControl] as FormArray).controls;
    }

    setAttachments(attachments: any[]): FormArray
    {
        const formArray = new FormArray([]);
        attachments.forEach((a: any) => {
            const attachmentIdFC = this._formBuilder.control(a.id);
            const attachmentNameFC = this._formBuilder.control(a.name);
            const attachmentPathFC = this._formBuilder.control(a.path);
            const attachmentFileFC = this._formBuilder.control(a.file);
            const attachmentExtensionFC = this._formBuilder.control(a.extension);

            const attachmentFG = this._formBuilder.group({
                id: attachmentIdFC,
                name: attachmentNameFC,
                path: attachmentPathFC,
                file: attachmentFileFC,
                extension: attachmentExtensionFC
            });

            formArray.push(attachmentFG);
        });
        return formArray;
    }

    onSelectFile(event): void {
        // console.log(event)
        if (event.target.files && event.target.files[0])
        {
            const formArray = this.productForm.controls.attachments as FormArray;
            const filesAmount = event.target.files.length;
            if (event.target.files[0].type.includes('jpeg') || event.target.files[0].type.includes('png'))
            {
                if (event.target.files[0].size > 1000000)
                {

                }
                else
                {
                    for (let i = 0; i < filesAmount; i++) 
                    {
                        const reader = new FileReader();
        
                        reader.onload = (_event: any) => {
                            const attachmentIdFC = this._formBuilder.control(0);
                            const attachmentNameFC = this._formBuilder.control(event.target.files[0].name);
                            const attachmentPathFC = this._formBuilder.control(undefined);
                            const attachmentFileFC = this._formBuilder.control(_event.target.result.split(',')[1]);
                            const attachmentExtensionFC = this._formBuilder.control(_event.target.result.split(',')[0]);
                
                            const attachmentFG = this._formBuilder.group({
                                id: attachmentIdFC,
                                name: attachmentNameFC,
                                path: attachmentPathFC,
                                file: attachmentFileFC,
                                extension: attachmentExtensionFC
                            });

                            formArray.push(attachmentFG);
                        };
        
                        reader.readAsDataURL(event.target.files[i]);
                    }

                    
                }

            }
            else
            {

            }
        }
    }

    removeAttachment(control, index): void 
    {
        control.removeAt(index);
    }

    saveProduct(): void
    {
        // console.log(this.productForm.value);
        if (this.productForm.value.id === 0) {
            this._configurationsProductsService.saveProduct(this.productForm.value).then(response => {
                if (response.isSuccess === false){
                    this._snackBar.open(response.message, 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['error-snackbar']
                    });
                }else{
                    this._snackBar.open('save data successed', 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['success-snackbar']
                    });
                    this._router.navigate(['/configurations/products']);
                }
            });
        }else{
            this._configurationsProductsService.updateProduct(this.productForm.value).then(response => {
                if (response.isSuccess === false){
                    this._snackBar.open(response.message, 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['error-snackbar']
                    });
                }else{
                    this._snackBar.open('save data successed', 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['success-snackbar']
                    });
                    this._router.navigate(['/configurations/products']);
                }
            });
        }
       
    }
}


