import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsSingleComponent } from './leads-single.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [LeadsSingleComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: LeadsSingleComponent,
            },
        ]),
    ],
})
export class LeadsSingleModule {}
