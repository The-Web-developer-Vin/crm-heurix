import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAdsListComponent } from './google-ads-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [GoogleAdsListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: GoogleAdsListComponent,
            },
        ]),
    ],
})
export class GoogleAdsListModule {}
