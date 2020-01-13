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
        promotionSubTypeId: [1, Validators.required],
        image1: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: ['']
        }),
        image2: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: ['']
        }),
        image3: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: ['']
        }),
        backgroundImage: this._formBuilder.group({
            name: [''],
            file: [''],
            extension: ['']
        })
    });

    

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    pageType: string;

    promotionId: number;
    promotion = {
        id: 0,
        name: undefined,
        description: undefined,
        isActived: false,
        promotionTypeId: 0,
        startDate: new Date(),
        endDate: new Date(),
        promotionSubTypeId: 1,
        image1: {
            name: '',
            file: '',
            extension: '',
        },
        image2: {
            name: '',
            file: '',
            extension: '',
        },
        image3: {
            name: '',
            file: '',
            extension: '',
        },
        backgroundImage: {
            name: '',
            file: '',
            extension: '',
        },
    };
    promotionTypes: [];

    constructor(
        private _configurationsPromotionService: ConfigurationsPromotionsService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
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

        this.route.params.subscribe(params => {
            this.promotionId = params['id'];
            if (this.promotionId > 0){
                this.pageType = 'edit';

                this._configurationsPromotionService.getPromotionById(this.promotionId).then(response => {
                    if (response.isSuccess)
                    {
                        this.promotion = response.promotion;
                        this.promotionForm = this._formBuilder.group({
                            id: this.promotionId,
                            name   : [this.promotion.name, [Validators.required]],
                            description: [this.promotion.description, Validators.required],
                            promotionTypeId: [this.promotion.promotionTypeId, [Validators.required]],
                            isActived: [this.promotion.isActived, [Validators.required]],
                            startDate: [this.promotion.startDate, [Validators.required]],
                            endDate: [this.promotion.endDate, [Validators.required]],
                            promotionSubTypeId: [this.promotion.promotionSubTypeId, [Validators.required]],
                            image1: this._formBuilder.group({
                                name: [this.promotion.image1.name],
                                file: [this.promotion.image1.file],
                                extension: [this.promotion.image1.extension]
                            }),
                            image2: this._formBuilder.group({
                                name: [this.promotion.image2.name],
                                file: [this.promotion.image2.file],
                                extension: [this.promotion.image2.extension]
                            }),
                            image3: this._formBuilder.group({
                                name: [this.promotion.image3.name],
                                file: [this.promotion.image3.file],
                                extension: [this.promotion.image3.extension]
                            }),
                            backgroundImage: this._formBuilder.group({
                                name: [this.promotion.backgroundImage.name],
                                file: [this.promotion.backgroundImage.file],
                                extension: [this.promotion.backgroundImage.extension]
                            }),
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
        
    }

    getControl(frmGrp: FormGroup, key: string): any {
        return (frmGrp.controls[key] as FormControl);
    }
    
    getControls(formGroup: FormGroup, fromControl: string): any{
        return (formGroup.controls[fromControl] as FormArray).controls;
    }

    onPromotionSubTypeIdChanged(event): void
    {
        console.log(event);
        const controls = this.getControl(this.promotionForm, 'promotionSubTypeId');
        controls.setValue(event.value);
    }

    onSelectFile(event, form: FormGroup): void {
        console.log(form)
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
        console.log(this.promotionForm.value);
        // this._configurationsPromotionService.createPromotion(this.promotionForm.value).then(response => {
        //     if (response.isSuccess){
        //         this._router.navigate(['configurations/promotions']);
        //     } else {
        //         console.error('fail');
        //     }
        // }, error => {
        //    console.error(error); 
        // });
    }

    updatePromotion(): void
    {
        // this._configurationsPromotionService.updatePromotion(this.promotionForm.value).then(response => {
        //     if (response.isSuccess){
        //         this._router.navigate(['configurations/promotions']);
        //     } else {
        //         console.error('fail');
        //     }
        // }, error => {
        //    console.error(error); 
        // });
    }

}


