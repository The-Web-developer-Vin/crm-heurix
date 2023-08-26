import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookAdsListComponent } from './facebook-ads-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [FacebookAdsListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: FacebookAdsListComponent,
            },
        ]),
    ],
})
export class FacebookAdsListModule {}
