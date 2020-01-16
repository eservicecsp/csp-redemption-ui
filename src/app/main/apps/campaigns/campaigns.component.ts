import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Inject } from '@angular/core';


import { fuseAnimations } from '@fuse/animations';
import { MatTabChangeEvent, MatDatepickerInputEvent, PageEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CampaignsService } from './campaigns.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector     : 'campaigns',
    templateUrl  : './campaigns.component.html',
    styleUrls    : ['./campaigns.component.scss'],
    animations   : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CampaignsComponent implements OnInit
{
    newCampaignColumns = [ 'name', 'description', 'camapignType', 'startDate', 'total', 'action'];
    activeCampaignColumns = [ 'name', 'description', 'camapignType', 'startDate', 'fail', 'empty', 'dupplicate', 'success', 'total', 'action'];
    expireCampaignColumns = [ 'name', 'description', 'camapignType', 'startDate', 'campaignStatusType', 'fail', 'empty', 'dupplicate', 'success', 'total', 'action'];
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
        public dialog: MatDialog
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
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        console.log(`${type}: ${event.value}`);
        this.getCampaigns();
    }

    getCampaigns(){
        
        let startDate = null;
        let endDate = null;

        console.log(this.searchForm.value.startDate);
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

    delete(camapign: any){
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
    updateStatus(camapign: any, status: number){
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
      @Inject(MAT_DIALOG_DATA) public data: null) {}
  
    // onNoClick(): void {
    //   this.dialogRef.close();
    // }
  
  }
