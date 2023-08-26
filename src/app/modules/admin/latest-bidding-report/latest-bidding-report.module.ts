import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { LatestBiddingReportComponent } from './latest-bidding-report.component';
import { MatSelectModule } from '@angular/material/select';
import { AddBiddingComponent } from './add-bidding/add-bidding.component';
import { AllBiddingReportComponent } from './all-bidding-report/all-bidding-report.component';
import { ResponseListComponent } from './response-list/response-list.component';
import { ConvertedListComponent } from './converted-list/converted-list.component';

@NgModule({
    declarations: [LatestBiddingReportComponent, AddBiddingComponent, AllBiddingReportComponent, ResponseListComponent, ConvertedListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: LatestBiddingReportComponent,
            },
        ]),
    ],
})
export class LatestBiddingReportModule {}
