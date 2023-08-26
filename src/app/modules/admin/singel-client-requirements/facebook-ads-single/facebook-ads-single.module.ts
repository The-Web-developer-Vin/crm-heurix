import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookAdsSingleComponent } from './facebook-ads-single.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [FacebookAdsSingleComponent],
    imports: [
        CommonModule,
        SharedModule,

        RouterModule.forChild([
            {
                path: '',
                component: FacebookAdsSingleComponent,
            },
        ]),
    ],
})
export class FacebookAdsSingleModule {}
