import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';

import { FooterComponent } from 'app/layout/components/footer/footer.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faChrome, faInternetExplorer, faFirefoxBrowser } from '@fortawesome/free-brands-svg-icons';

@NgModule({
    declarations: [
        FooterComponent
    ],
    imports     : [
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatToolbarModule,

        FuseSharedModule,

        FontAwesomeModule,
    ],
    exports     : [
        FooterComponent
    ]
})
export class FooterModule
{
    constructor(private library: FaIconLibrary){
        library.addIcons(faChrome, faInternetExplorer, faFirefoxBrowser);
    }
}
