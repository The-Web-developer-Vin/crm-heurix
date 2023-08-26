import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAdsSingleComponent } from './google-ads-single.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [GoogleAdsSingleComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: GoogleAdsSingleComponent,
            },
        ]),
    ],
})
export class GoogleAdsSingleModule {}
