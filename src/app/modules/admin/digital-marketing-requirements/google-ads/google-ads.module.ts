import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { GoogleAdsComponent } from './google-ads.component';

@NgModule({
    declarations: [GoogleAdsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: GoogleAdsComponent,
            },
        ]),
    ],
})
export class GoogleAdsModule {}
