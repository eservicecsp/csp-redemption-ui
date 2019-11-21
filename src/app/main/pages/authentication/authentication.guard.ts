import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { MatDialog } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthenticationGuard implements CanActivate{
    constructor(
        private _authenticationService: AuthenticationService,
        private router: Router,
        private _fuseNavigationService: FuseNavigationService,
        public _matDialog: MatDialog,
        private _translateService: TranslateService,
      ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        
        if (this._authenticationService.isLoggedOut()) 
        {
            this._authenticationService.logout();
            this.router.navigate(['/pages/auth/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }

        this._authenticationService.isUserLoggedOnElsewhere().then((isLoggedElsewhere: boolean) => {
            if (isLoggedElsewhere){
                
                // Call dialog
                // LoggedDialogComponent
                // const dialogRef = this._matDialog.open(LoggedDialogComponent, {
                //     width: '450px',
                //     panelClass: 'logged-dialog',
                // });
              
                // dialogRef.afterClosed().subscribe(result => {
                //     this._authenticationService.logout();
                //     this.router.navigate(['/pages/auth/login'], { queryParams: { returnUrl: state.url }});
                //     return false;
                // });
            }
        });

        this._authenticationService.authorize().then(response => {
            if (response.isSuccess)
            {
                // Add customize nav item that opens the bar programmatically
                const menu20100 = {
                    id: '20100',
                    title: 'Staffs',
                    translate: 'NAV.STAFF.TITLE',
                    type: 'item',
                    icon: 'account_circle',
                    children: [],
                    url: 'configurations/staffs',
                    badge: null
                };
                const is20100Exist = this._fuseNavigationService.getNavigationItem('20100');
                if (is20100Exist)
                {
                    if (response.roleMenus.filter(x => x.id === 20100) === undefined || response.roleMenus.filter(x => x.id === 20100).length === 0)
                    {
                        this._fuseNavigationService.removeNavigationItem(menu20100.id);
                    }
                }
                else
                {
                    if (response.roleMenus.filter(x => x.id === 20100).length !== 0)
                    {
                        this._fuseNavigationService.addNavigationItem(menu20100, 'end');
                    }
                }

                const menu20000 = this._fuseNavigationService.getNavigationItem('20000');
                console.log(menu20000.children)
                if (menu20000.children === undefined || menu20000.children.length === 0){
                    this._fuseNavigationService.removeNavigationItem(menu20000.id);
                }
            }
        });
        
        return true;
    }
}
