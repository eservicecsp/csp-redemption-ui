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
                this._authenticationService.getHeaderFunctions().then(parentsResponse => {
                    if (parentsResponse.isSuccess)
                    {
                        if (parentsResponse.functions.length > 0)
                        {
                            parentsResponse.functions.forEach(parent => {
                                this._fuseNavigationService.removeNavigationItem(parent.id.toString());
                            });
                        }

                        if (response.navigations.length > 0){
                            response.navigations.forEach(group => {
                                const _group = this._fuseNavigationService.getNavigationItem(group.id);
                                if (!_group)
                                {
                                    const navItem = group;
                                    this._fuseNavigationService.addNavigationItem(navItem, 'end');
                                }
                            });
                        }
                    }
                    else
                    {
                        
                    }

                    
                });
            }
        });
        
        return true;
    }
}
