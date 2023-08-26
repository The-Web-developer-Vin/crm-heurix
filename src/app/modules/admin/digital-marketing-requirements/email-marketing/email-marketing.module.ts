import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailMarketingComponent } from './email-marketing.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [EmailMarketingComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: EmailMarketingComponent,
            },
        ]),
    ],
})
export class EmailMarketingModule {}
