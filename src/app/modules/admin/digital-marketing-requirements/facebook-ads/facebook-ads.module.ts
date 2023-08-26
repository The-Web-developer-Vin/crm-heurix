import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookAdsComponent } from './facebook-ads.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [FacebookAdsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: FacebookAdsComponent,
            },
        ]),
    ],
})
export class FacebookAdsModule {}
