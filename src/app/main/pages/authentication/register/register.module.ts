import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { RegisterComponent } from 'app/main/pages/authentication/register/register.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule} from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatStepperModule } from '@angular/material';

const routes = [
    {
        path     : 'auth/register',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        // FlexLayoutModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCardModule,
        HttpClientModule,
        MatSnackBarModule,
        FuseSharedModule,
        MatStepperModule,
    ]
})
export class RegisterModule
{
}
