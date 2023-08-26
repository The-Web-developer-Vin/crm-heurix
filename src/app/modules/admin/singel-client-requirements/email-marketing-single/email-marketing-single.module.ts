import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailMarketingSingleComponent } from './email-marketing-single.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [EmailMarketingSingleComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: EmailMarketingSingleComponent,
            },
        ]),
    ],
})
export class EmailMarketingSingleModule {}
