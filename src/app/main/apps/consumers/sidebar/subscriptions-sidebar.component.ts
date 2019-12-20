import { Component,  } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector   : 'subscriptions-sidebar',
    templateUrl: './subscriptions-sidebar.component.html',
    styleUrls  : ['./subscriptions-sidebar.component.scss']
})
export class SubscriptionsSidebarComponent
{
    selected: any;
    gender: string;
    genders: string[] = ['Male', 'Female', 'All'];

    isSkincare = false;
    isMakeup = false;
    isBodycare = false;
    isSupplements = false;

    autoTicks = false;
    disabled = false;

    // startAgeRanges = 0;
    // ageRanges = { range_start: 0, range_end: 100 };
  
    constructor()
    {
        
    }

    sendFilter(): void
    {
        // const filters = {
        //     gender: this.gender,
        //     isSkincare: this.isSkincare,
        //     isMakeup: this.isMakeup,
        //     isBodycare: this.isBodycare,
        //     isSupplements: this.isSupplements,
        //     // startAge: this.ageRanges.range_start,
        //     // endAge: this.ageRanges.range_end,
        // };
        // this._subscriptionsService.onFiltersChanged.next(filters);
    }

}
