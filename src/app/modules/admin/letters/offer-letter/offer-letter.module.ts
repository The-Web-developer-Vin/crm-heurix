import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { OfferLetterComponent } from './offer-letter.component';

@NgModule({
    declarations: [OfferLetterComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: OfferLetterComponent,
            },
        ]),
    ],
})
export class OfferLetterModule {}
