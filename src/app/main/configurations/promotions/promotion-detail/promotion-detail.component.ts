import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { ConfigurationsPromotionsService } from '../promotions.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

import * as moment from 'moment';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfigurationsProductsService } from '../../products/products.service';
import { ConfigurationsContactUsService } from '../../contact-us/contact-us.service';

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector     : 'promotion-detail',
    templateUrl  : './promotion-detail.component.html',
    styleUrls    : ['./promotion-detail.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class PromotionDetailComponent implements OnInit
{
    promotionForm = this._formBuilder.group({
        id: [0],
        name   : ['', [Validators.required]],
        description: ['', Validators.required],
        createdBy: [0],
        promotionTypeId: [0, [Validators.required]],
        isActived: [false, [Validators.required]],
        startDate: [new Date(), [Validators.required]],
        endDate: [new Date(), [Validators.required]],
        promotionSubTypeId: [],
        memberDiscount: 0,
        birthDateDiscount: 0,
        productGroupDiscount: 0,
        productId: 0,
        tel: [''],
        facebook   : [''],
        line: [''],
        web : [''],
        image1: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: [''],
            imageUrl: ['']
        }),
        image2: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: [''],
            imageUrl: ['']
        }),
        image3: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: [''],
            imageUrl: ['']
        }),
        backgroundImage: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: [''],
            imageUrl: ''
        })
    });

    

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    IsReadonly = false;

    pageType: string;
    products: any[];
    promotionId: number;
    promotion = {
        id: 0,
        name: undefined,
        description: undefined,
        isActived: false,
        promotionTypeId: 1,
        startDate: new Date(),
        endDate: new Date(),
        promotionSubTypeId: 1,
        memberDiscount: 0,
        birthDateDiscount: 0,
        productGroupDiscount: 0,
        productId: 0,
        tel: [''],
        facebook   : [''],
        line: [''],
        web : [''],
        image1: {
            name: '',
            file: '',
            extension: '',
            imageUrl: ''
        },
        image2: {
            name: '',
            file: '',
            extension: '',
            imageUrl: ''
        },
        image3: {
            name: '',
            file: '',
            extension: '',
            imageUrl: ''
        },
        backgroundImage: {
            name: '',
            file: '',
            extension: '',
            imageUrl: ''
        },
    };
    promotionTypes: [];
    promotionSubTypes: [];

    constructor(
        private _configurationsPromotionService: ConfigurationsPromotionsService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute,
        private _configurationsProductsService: ConfigurationsProductsService,
        private _configurationsContactUsService: ConfigurationsContactUsService,
    )
    {
        this.promotionId = 0;

        this._configurationsPromotionService.getPromotionTypes().then(response => {
            if (response.isSuccess){
                this.promotionTypes = response.promotionTypes;
            }
            else {

            }
        });
        this._configurationsPromotionService.getPromotionSubTypes().then(response => {
            if (response.isSuccess){
                this.promotionSubTypes = response.promotionSubTypes;
            }
            else {

            }
        });

        this._configurationsProductsService.getProducts().then(res => {
            if (res.isSuccess){
                this.products = res.products;
            }
        });

        this.route.params.subscribe(params => {
            this.promotionId = params['id'];
            if (this.promotionId > 0){
                this.pageType = 'edit';

                this._configurationsPromotionService.getPromotionById(this.promotionId).then(response => {
                    
                    if (response.isSuccess)
                    {
                        this.IsReadonly = true;
                        this.promotion = response.promotion;
                        this.promotionForm = this._formBuilder.group({
                            id: this.promotionId,
                            name   : [this.promotion.name, [Validators.required]],
                            description: [this.promotion.description, Validators.required],
                            promotionTypeId: [{value:this.promotion.promotionTypeId, disabled: true}],
                            //promotionTypeId: new FormControl({value: this.promotion.promotionTypeId,  disabled: true}),
                            isActived: [this.promotion.isActived, [Validators.required]],
                            startDate: [this.promotion.startDate, [Validators.required]],
                            endDate: [this.promotion.endDate, [Validators.required]],
                            //promotionSubTypeId: [this.promotion.promotionSubTypeId, [Validators.required]],
                            promotionSubTypeId: new FormControl({value: this.promotion.promotionSubTypeId, disabled: true}),
                            memberDiscount: this.promotion.memberDiscount,
                            birthDateDiscount: this.promotion.birthDateDiscount,
                            productGroupDiscount: this.promotion.productGroupDiscount,
                            productId: this.promotion.productId,
                            tel: this.promotion.tel,
                            facebook   : this.promotion.facebook,
                            line: this.promotion.line,
                            web : this.promotion.web,
                            image1: this._formBuilder.group({
                                name: [this.promotion.image1.name],
                                file: [this.promotion.image1.file],
                                extension: [this.promotion.image1.extension],
                                imageUrl: [this.promotion.image1.imageUrl]
                            }),
                            image2: this._formBuilder.group({
                                name: [this.promotion.image2.name],
                                file: [this.promotion.image2.file],
                                extension: [this.promotion.image2.extension],
                                imageUrl: [this.promotion.image2.imageUrl]
                            }),
                            image3: this._formBuilder.group({
                                name: [this.promotion.image3.name],
                                file: [this.promotion.image3.file],
                                extension: [this.promotion.image3.extension],
                                imageUrl: [this.promotion.image3.imageUrl]
                            }),
                            backgroundImage: this._formBuilder.group({
                                name: [this.promotion.backgroundImage.name],
                                file: [this.promotion.backgroundImage.file],
                                extension: [this.promotion.backgroundImage.extension],
                                imageUrl: [this.promotion.backgroundImage.imageUrl]
                            }),
                        });
                        this.promotionForm.get('promotionTypeId').disable();
                    }
                });
            }
            else
            {
                this.pageType = 'new';
                this._configurationsContactUsService.getContactUs().then(response => {
                    if (response.isSuccess){
                        if (response.contactUs != null){
                            this.promotionForm.controls['tel'].setValue(response.contactUs.tel);
                            this.promotionForm.controls['facebook'].setValue(response.contactUs.facebook);
                            this.promotionForm.controls['line'].setValue(response.contactUs.line);
                            this.promotionForm.controls['web'].setValue(response.contactUs.web);
                        }
                    }
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
        // console.log(formGroup);
        // console.log(formGroup.controls[fromControl]);
        return (formGroup.controls[fromControl] as FormArray).controls;
    }

    onPromotionSubTypeIdChanged(event): void
    {
        console.log(event);
        const controls = this.getControl(this.promotionForm, 'promotionSubTypeId');
        controls.setValue(event.value);
        
        this.promotionForm.controls['image1'].get('name').setValue(undefined);
        this.promotionForm.controls['image2'].get('name').setValue(undefined);
        this.promotionForm.controls['image3'].get('name').setValue(undefined);
        this.promotionForm.controls['image3'].get('name').setValue(undefined);

        this.promotionForm.controls['image1'].get('file').setValue(undefined);
        this.promotionForm.controls['image2'].get('file').setValue(undefined);
        this.promotionForm.controls['image3'].get('file').setValue(undefined);

        this.promotionForm.controls['image1'].get('extension').setValue(undefined);
        this.promotionForm.controls['image2'].get('extension').setValue(undefined);
        this.promotionForm.controls['image3'].get('extension').setValue(undefined);

        this.promotionForm.controls['image1'].get('imageUrl').setValue(undefined);
        this.promotionForm.controls['image2'].get('imageUrl').setValue(undefined);
        this.promotionForm.controls['image3'].get('imageUrl').setValue(undefined);

        const a = {
            name: undefined,
            file: undefined,
            extension: undefined,
            imageUrl: undefined
        };
        this.promotion.image1 = a;
        this.promotion.image2 = a;
        this.promotion.image3 = a;
    }

    onSelectFile(event, form: FormGroup): void {

        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            // const controlid = form.get('attachmentId') as FormControl;
            const control = form.get('file') as FormControl;
            const controlname = form.get('name') as FormControl;
            // console.log(controlname);
            if (event.target.files[0].type.includes('jpeg') || event.target.files[0].type.includes('png')){
                if (event.target.files[0].size > 1000000){
                    this._snackBar.open('File size must smaller than 1 MB', 'Close', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        panelClass: ['blue-snackbar']
                    });
                    control.setValue(null);
                    controlname.setValue(null);
                }
                else{
                    for (let i = 0; i < filesAmount; i++) {
                        const reader = new FileReader();
        
                        reader.onload = (_event: any) => {
                        control.setValue(_event.target.result);
                        
                        };
        
                        reader.readAsDataURL(event.target.files[i]);
                    }
                    controlname.setValue(event.target.files[0].name);
                    // controlid.setValue(0);
                }
            }
            else{
                this._snackBar.open('Accept only jpeg and png file extension.', 'Close', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: ['blue-snackbar']
                });
                control.setValue(null);
                controlname.setValue(null);
            }
        }
    }

    clearAttachFile(form: FormGroup): void {
        const fileFC = form.get('file') as FormArray;
        const nameFC = form.get('name') as FormArray;
        fileFC.setValue(null);
        nameFC.setValue(null);
    }

    createPromotion(): void
    {
        // const startDate: Date = this.promotionForm.value.startDate.format('YYYY-MM-DD');
        // const endDate: Date = this.promotionForm.value.endDate.format('YYYY-MM-DD');
        // this.promotionForm.controls['startDate'].setValue(startDate);
        // this.promotionForm.controls['endDate'].setValue(endDate);
        this.promotionForm.controls['startDate'].setValue(moment(this.promotionForm.value.startDate).format('YYYY-MM-DD'));
        this.promotionForm.controls['endDate'].setValue(moment(this.promotionForm.value.endDate).format('YYYY-MM-DD'));

        //console.log(this.promotionForm.value)
        this._configurationsPromotionService.createPromotion(this.promotionForm.value).then(response => {
            if (response.isSuccess){
                this._router.navigate(['configurations/promotions']);
            } else {
                console.error('fail');
            }
        }, error => {
           console.error(error); 
        });
    }

    updatePromotion(): void
    {
        
        // const startDate: Date = this.promotionForm.value.startDate.format('YYYY-MM-DD');
        // const endDate: Date = this.promotionForm.value.endDate.format('YYYY-MM-DD');
        this.promotionForm.controls['startDate'].setValue(moment(this.promotionForm.value.startDate).format('YYYY-MM-DD'));
        this.promotionForm.controls['endDate'].setValue(moment(this.promotionForm.value.endDate).format('YYYY-MM-DD'));

        //console.log(this.promotionForm.value);
        this._configurationsPromotionService.updatePromotion(this.promotionForm.value).then(response => {
            if (response.isSuccess){
                this._router.navigate(['configurations/promotions']);
            } else {
                console.error('fail');
            }
        }, error => {
           console.error(error); 
        });
    }

}


