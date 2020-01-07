import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';

import { ConfigurationsRolesService } from '../roles.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

@Component({
    selector     : 'role-detail',
    templateUrl  : './role-detail.component.html',
    styleUrls    : ['./role-detail.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class RoleDetailComponent implements OnInit
{
    roleForm = this._formBuilder.group({
        id: [0],
        name   : ['', [Validators.required]],
        description: ['', Validators.required],
        functions: [undefined]
        // createdBy: [0],
        // roleTypeId: [0, [Validators.required]],
        // isActived: [false, [Validators.required]],
    });

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    pageType: string;
    
    functions = [];

    roleId: number;
    role = {
        id: 0,
        name: undefined,
        description: undefined,
        functions: undefined
        // isActived: false,
        // roleTypeId: 0
    };

    constructor(
        private _configurationsRolesService: ConfigurationsRolesService,
        private _authenticationService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
        this.roleId = 0;

        this.route.params.subscribe(params => {
            this.roleId = params['id'];
            if (this.roleId > 0){
                this.pageType = 'edit';

                this._configurationsRolesService.getRoleById(this.roleId).then(response => {
                    if (response.isSuccess)
                    {
                        this.role = response.role;
                        this.roleForm = this._formBuilder.group({
                            id: this.roleId,
                            name   : [this.role.name, [Validators.required]],
                            description: [this.role.description, Validators.required],
                            functions: [undefined]
                            // roleTypeId: [this.role.roleTypeId, [Validators.required]],
                            // isActived: [this.role.isActived, [Validators.required]]
                        });
                        const functions = [];
                        this.role.functions.forEach(_function => {
                            if (_function.level !== 0){
                                functions.push(_function.id);
                            }
                            
                        });

                        this.roleForm.controls['functions'].setValue(functions);
                    }
                    
                });

                
            }
            else
            {
                this.pageType = 'new';
            }
            
        });

        this._configurationsRolesService.getChildFunctions().then(response => {
            this.functions = response.functions;
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

    createRole(): void
    {
        // this._configurationsRolesService.createRole(this.roleForm.value).then(response => {
        //     if (response.isSuccess){
        //         this._router.navigate(['configurations/roles']);
        //     } else {
        //         console.error('fail');
        //     }
        // }, error => {
        //    console.error(error); 
        // });
        console.log(this.roleForm.value);
    }

    updateRole(): void
    {
        const data = {
            id: this.roleForm.value.id,
            name: this.roleForm.value.name,
            description: this.roleForm.value.description,
            functions: [],
        };
        const functions = this.roleForm.value.functions;
        functions.forEach(element => {
            data.functions.push({id: element});
        });
        // console.log(data);
        this._configurationsRolesService.updateRole(data).then(response => {
            if (response.isSuccess){
                this._router.navigate(['configurations/roles']);
            } else {
                console.error('fail');
            }
        }, error => {
           console.error(error); 
        });
    }

}


