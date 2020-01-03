import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { ConfigurationsBrandsService } from '../brands.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

@Component({
    selector     : 'brand-detail',
    templateUrl  : './brand-detail.component.html',
    styleUrls    : ['./brand-detail.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class BrandDetailComponent implements OnInit
{
    brandForm = this._formBuilder.group({
        code: ['', [Validators.required]],
        name   : ['', [Validators.required]],
        isOwner: ['', Validators.required],
        staff: this._formBuilder.group({
            id: [0],
            email: [undefined, [Validators.required]],
            //password: [undefined, [Validators.required]],
            firstName: [undefined, [Validators.required]],
            lastName: [undefined, [Validators.required]],
            phone: [undefined, [Validators.required]],
            roleId: [0, [Validators.required]],
            brandId: [0, [Validators.required]],
            isActived: [false, [Validators.required]],
        })
    });


    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    pageType: string;

    brandId: number;
    brand = {
        code: undefined,
        name: undefined,
        isOwner: undefined,
        staff: {
            id: 0,
            email: undefined,
            //password: undefined,
            firstName: undefined,
            lastName: undefined,
            phone: undefined,
            roleId: 0,
            brandId: 0,
            isActived: false
        }
    };

    constructor(
        private _configurationsBrandService: ConfigurationsBrandsService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
        this.brandId = 0;

        this.route.params.subscribe(params => {
            this.brandId = params['id'];
            if (this.brandId > 0){
                this.pageType = 'edit';

                this._configurationsBrandService.getBrandById(this.brandId).then(response => {
                    if (response.isSuccess)
                    {
                        this.brand = response.brand;
                        this.brandForm = this._formBuilder.group({
                            id : this.brandId,
                            code: [{value: this.brand.code, disabled: true}, [Validators.required]],
                            name   : [this.brand.name, [Validators.required]],
                            isOwner: [this.brand.isOwner, Validators.required],
                            staff: this._formBuilder.group({
                                id: [this.brand.staff.id],
                                email: [{value: this.brand.staff.email, disabled: true}, [Validators.required]], 
                                //password: [this.brand.staff.password, [Validators.required]],
                                firstName: [this.brand.staff.firstName],
                                lastName: [this.brand.staff.lastName],
                                phone: [this.brand.staff.phone],
                                roleId: [this.brand.staff.roleId],
                                brandId: [this.brand.staff.brandId],
                                isActived: [this.brand.staff.isActived, [Validators.required]],
                            })
                        });

                        // this.brandAdminForm = this._formBuilder.group({
                        //     id: [0],
                        //     email: [this.brand.staff.email, [Validators.required]],
                        //     password: [this.brand.staff.password, [Validators.required]],
                        //     firstname: [this.brand.staff.firstname, [Validators.required]],
                        //     lastname: [this.brand.staff.lastname, [Validators.required]],
                        //     phone: [this.brand.staff.phone, [Validators.required]],
                        //     roleId: [this.brand.staff.roleId, [Validators.required]],
                        //     brandId: [this.brand.staff.brandId, [Validators.required]],
                        //     isActived: [this.brand.staff.isActived, [Validators.required]],
                        // });
                    }
                });
            }
            else
            {
                this.pageType = 'new';
                this.brandForm = this._formBuilder.group({
                    code: [ null, [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
                    name   : [ null, [Validators.required]],
                    isOwner: [false],
                    staff: this._formBuilder.group({
                        id: [0],
                        email: [null, [Validators.required, Validators.email]],
                        //password: [this.brand.staff.password, [Validators.required]],
                        firstName: [null, [Validators.required]],
                        lastName: [null, [Validators.required]],
                        phone: [null, [Validators.required]],
                        isActived: [null],
                    })
                });
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
        
    }

    getControl(frmGrp: FormGroup, key: string): any {
        return (frmGrp.controls[key] as FormControl);
    }
    
    getControls(formGroup: FormGroup, fromControl: string): any{
        return (formGroup.controls[fromControl] as FormArray).controls;
    }

    createBrand(): void
    {
        const data = {
            brand : this.brandForm.value,
            staff : this.brandForm.get('staff').value,
        };
        console.log(data);
        this._configurationsBrandService.createBrand(data).then(response => {
            console.log(response);
            if (response.isSuccess){
                this._snackBar.open('save data successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
                this._router.navigate(['configurations/brands']);
            } else {
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
    }

    updateBrand(): void
    {
        const data = {
            brand : this.brandForm.value,
            staff : this.brandForm.get('staff').value,
        };
        this._configurationsBrandService.updateBrand(data).then(response => {
            if (response.isSuccess){
                this._snackBar.open('Update data successed', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['success-snackbar']
                });
                this._router.navigate(['configurations/brands']);
            } else {
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
    }

}


