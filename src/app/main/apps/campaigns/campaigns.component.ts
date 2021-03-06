import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Inject } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';
import { MatTabChangeEvent, MatDatepickerInputEvent, PageEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { CampaignsService } from './campaigns.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardsCampaignsService } from '../dashboards/campaigns/dashboards-campaigns.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';


@Component({
    selector     : 'campaigns',
    templateUrl  : './campaigns.component.html',
    styleUrls    : ['./campaigns.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class CampaignsComponent implements OnInit
{
    newCampaignColumns = [ 'name', 'description', 'camapignType', 'startDate', 'total', 'action'];
    activeCampaignColumns = [ 'name', 'description', 'camapignType', 'startDate', 'total', 'enroll', 'success', 'fail', 'empty', 'dupplicate', 'action'];
    expireCampaignColumns = [ 'name', 'description', 'camapignType', 'startDate', 'campaignStatusType', 'total', 'enroll', 'success', 'fail', 'empty', 'dupplicate',   'action'];
    dataSource: any[];
    tabIndex: number;
    searchValue: string;

    pageEvent: PageEvent;
    length = 0;
    pageIndex = 0;
    pageSize = 5;
    previousPageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    searchForm: FormGroup;
    
    constructor(
        private _campaignsService: CampaignsService,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        private _router: Router,
        private _dashboardsCampaignsService: DashboardsCampaignsService
    )
    {
        this.tabIndex = 0;
        this.searchForm = this._formBuilder.group({
            startDate: null,
            endDate: null,
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
        this.tabIndex = 0;
        this.getCampaigns();
        
    }
    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index;
        this.getCampaigns();
    }

    searchChange(): void
    {
        console.log(this.tabIndex);
    }
    onSearchChange(searchValue: string): void {  
        this.searchValue = searchValue;
        this.getCampaigns();
    }
    addEvent(type: string, event: MatDatepickerInputEvent<Date>): void 
    {
        console.log(`${type}: ${event.value}`);
        this.getCampaigns();
    }

    getCampaignDetail(campaign): void
    {
        console.log(campaign);
        // this._router.navigate(['/apps/dashboards/campaigns/' + campaignId]);
        this._dashboardsCampaignsService.onSelectedCampaignChanged.next(campaign);
        this._router.navigate(['/apps/dashboards/campaigns', { id: campaign.id }]);
        // apps/dashboards/campaigns
    }

    getCampaigns(): void
    {
        
        let startDate = null;
        let endDate = null;

        if (this.searchForm.value.startDate != null){
            startDate =  moment(this.searchForm.value.startDate).format('YYYY-MM-DD');
        }
        
        if (this.searchForm.value.endDate != null){
            endDate =  moment(this.searchForm.value.endDate).format('YYYY-MM-DD');
        }
       
        // if( !== ''){
        //     //this.startDate = moment(this.startDate.nativeElement.value).format('YYYY-MM-DD');
        // }
        const data = {
            length: this.pageEvent ? this.pageEvent.length : 0,
            pageIndex: this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex,
            pageSize: this.pageEvent ? this.pageEvent.pageSize : this.pageSize,
            previousPageIndex: this.pageEvent ? this.pageEvent.previousPageIndex : this.previousPageIndex,
            filtersCampaign: {
                startDate: startDate,
                endDate: endDate,
                campaignName: this.searchValue,
                campaignStatusId: this.tabIndex + 1
            }
        };
        this.dataSource = [];
        this._campaignsService.getCampaigns(data).then(response => {
            if (response.isSuccess){
                this.dataSource = response.campaignPagination;
                this.length = response.length;
            }
        });
    }

    delete(camapign: any): void
    {
        // console.log(camapign);
        const dialogRef = this.dialog.open(DialogDelete, {
            width: '250px',
            data: {name: camapign.name, type: 'Delete'}
          });
      
        dialogRef.afterClosed().subscribe(result => {
              if (result === true){
                  const data = {
                    campaignId: camapign.id,
                    campaignStatusId: 3
                  }
                  this._campaignsService.updateStatusCampaigns(data).then(response => {
                    if (response.isSuccess){
                        this. getCampaigns();
                    }
                  });
                 
              }

          });
    }

    updateStatus(camapign: any, status: number): void
    {
        // console.log(camapign);
        const dialogRef = this.dialog.open(DialogDelete, {
            width: '250px',
            data: {name: camapign.name, type: status === 2 ? 'Approve' : 'Delete'}
          });
      
        dialogRef.afterClosed().subscribe(result => {
              if (result === true){
                  const data = {
                    campaignId: camapign.id,
                    campaignStatusId: status
                  };
                  this._campaignsService.updateStatusCampaigns(data).then(response => {
                    if (response.isSuccess){
                        this. getCampaigns();
                    }
                  });
                 
              }

          });
    }   
}

@Component({
    selector: 'dialog-delete',
    templateUrl: 'dialog-delete.html',
  })
  export class DialogDelete {
  
    constructor(
      public dialogRef: MatDialogRef<DialogDelete>,
      @Inject(MAT_DIALOG_DATA) public data: { name,type}) {}
  
    // onNoClick(): void {
    //   this.dialogRef.close();
    // }
  
  }
