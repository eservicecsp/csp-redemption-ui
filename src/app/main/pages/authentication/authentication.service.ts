import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { map, tap } from 'rxjs/operators';
import { error } from 'util';
import { environment } from 'environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { User } from './user.model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class AuthenticationService
{
    private _jwtHelper = new JwtHelperService();

    constructor(
        private _httpClient: HttpClient,
        private _fuseNavigationService: FuseNavigationService)
    {
        // Set the defaults
    }

    login(user: User): Promise<any>
    {   
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/staffs/login', user)
            .subscribe((response: any) => {
                if (this.setSession(response))
                {
                    resolve(response);
                }
                else{
                    reject();
                }
            }, reject);
        });

        // this is just the HTTP call, 
        // we still need to handle the reception of the token
        // .shareReplay();
    }

    private setSession(authResult): boolean
    {
        localStorage.clear();
        localStorage.setItem('access_token', authResult.token);
        localStorage.setItem('expires_at', JSON.stringify(this.getRawAccessToken('exp').valueOf()));
        return true;
    }

    isUserLoggedOnElsewhere(): Promise<any>{
        const userId = this.getRawAccessToken('userid');
        const sessionId = localStorage.getItem('access_token');
        const data = {
            userId: userId,
            sessionId: sessionId
        };
        
        return new Promise((resolve, reject) => {

            resolve(false)
            // this._httpClient.post(environment.apiBaseUrl + '/users/checksession/', data)
            // .subscribe((response: boolean) => {
            //     resolve(response);
            // }, reject);
        });
    }

    logout(): void
    {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
    }

    public isLoggedIn(): any
    {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut(): boolean
    {
        return !this.isLoggedIn();
    }

    getExpiration(): any
    {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt * 1000);
    }

    getRawAccessToken(key: string): any
    {
        const accessToken = this._jwtHelper.decodeToken(localStorage.getItem('access_token'));
        if (!accessToken)
        {
            return '';
        }
        else
        {
            return accessToken[key];
        }
        
    }

    authorize(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/staffs/authorize')
            .subscribe(response => {
                resolve(response);
            }, reject);
        });
    }

    getHeaderFunctions(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/functions?type=parent')
            .subscribe(response => {
                resolve(response);
            }, reject);
        });
    }

    register(data: any): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.post(environment.apiBaseUrl + '/brands/create' , data)
                .subscribe(response => {
                    resolve(response);
                });
        });
    }

    // getPermission(data: any): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {

    //         this._httpClient.post(environment.apiBaseUrl + '/users/permission' , data)
    //             .subscribe(response => {
    //                 resolve(response);
    //             });
    //     });
    // }

    // getResetPasswordToken(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {

    //         this._httpClient.get(environment.apiBaseUrl + '/users/forgot-password/gettoken')
    //             .subscribe(response => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    // sendResetMail(params: string): Promise<any>{
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.get(environment.apiBaseUrl + '/users/forgot-password/' + params)
    //             .subscribe(response => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    // resetPassword(data): Promise<any>{
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.post(environment.apiBaseUrl + '/users/reset-password/', data)
    //             .subscribe(response => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    // changePassword(data): Promise<any>{
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.post(environment.apiBaseUrl + '/users/changepassword/', data)
    //             .subscribe(response => {
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    getResetPasswordToken(email: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiBaseUrl + '/staffs/ResetPasswordToken?email=' + email)
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }

    resetPassword(staff: any): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiBaseUrl + '/staffs/ResetPassword', staff)
                .subscribe(response => {
                    resolve(response);
                }, reject);
        });
    }
}
