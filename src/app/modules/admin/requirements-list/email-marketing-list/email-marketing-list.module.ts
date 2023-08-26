import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { EmailMarketingListComponent } from './email-marketing-list.component';

@NgModule({
    declarations: [EmailMarketingListComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: EmailMarketingListComponent,
            },
        ]),
    ],
})
export class EmailMarketingListModule {}
