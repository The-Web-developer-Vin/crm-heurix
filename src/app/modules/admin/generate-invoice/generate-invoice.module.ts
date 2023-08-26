import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GenerateInvoiceComponent } from './generate-invoice.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [GenerateInvoiceComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: GenerateInvoiceComponent,
            },
        ]),
        SharedModule,
    ],
})
export class GenerateInvoiceModule {}
