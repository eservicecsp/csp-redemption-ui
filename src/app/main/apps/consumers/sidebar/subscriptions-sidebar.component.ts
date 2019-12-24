import { Component,  } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ConsumersService } from '../consumers.service';

@Component({
    selector   : 'subscriptions-sidebar',
    templateUrl: './subscriptions-sidebar.component.html',
    styleUrls  : ['./subscriptions-sidebar.component.scss']
})
export class SubscriptionsSidebarComponent
{
    selected: any;

    autoTicks = false;
    disabled = false;
    isSkincare = false;
    isMakeup = false;
    isBodycare = false;
    isSupplements = false;

    ageRange: any;
    ageRanges = [
        {
            description: 'All',
            startAge: 0,
            endAge: 120
        },
        {
            description: '0 - 15 Year\'s old',
            startAge: 0,
            endAge: 15
        },
        {
            description: '16 - 25 Year\'s old',
            startAge: 16,
            endAge: 25
        },
        {
            description: '26 - 30 Year\'s old',
            startAge: 26,
            endAge: 30
        },
        {
            description: '31 - 45 Year\'s old',
            startAge: 31,
            endAge: 45
        },
        {
            description: '46 - 60 Year\'s old',
            startAge: 46,
            endAge: 60
        },
        {
            description: 'Age over 60 Year\'s old',
            startAge: 61,
            endAge: 120
        },
    ];
  
    birthOfMonth: number;
    birthOfMonths = [
        {
            id: 0,
            name: 'All'
        },
        {
            id: 1,
            name: 'January'
        },
        {
            id: 2,
            name: 'February'
        },
        {
            id: 3,
            name: 'March'
        },
        {
            id: 4,
            name: 'April'
        },
        {
            id: 5,
            name: 'May'
        },
        {
            id: 6,
            name: 'June'
        },
        {
            id: 7,
            name: 'July'
        },
        {
            id: 8,
            name: 'August'
        },
        {
            id: 9,
            name: 'September'
        },
        {
            id: 10,
            name: 'October'
        },
        {
            id: 11,
            name: 'November'
        },
        {
            id: 12,
            name: 'December'
        }
        
    ];
    phone: string;
    email: string
    constructor(
        private _consumersService: ConsumersService
        )
    {
        
    }

    sendFilter(): void
    {
        const filters = {
            startAge: this.ageRange ? this.ageRange.startAge : 0,
            endAge: this.ageRange ? this.ageRange.endAge : 120,
            birthOfMonth: this.birthOfMonth ? this.birthOfMonth : 0,
            phone: this.phone ,
            email: this.email,
            isSkincare: this.isSkincare,
            isMakeup: this.isMakeup,
            isBodycare: this.isBodycare,
            isSupplements: this.isSupplements, 
        };
        // console.log(filters);
        this._consumersService.onFiltersChanged.next(filters);
    }
}
