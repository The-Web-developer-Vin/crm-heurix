import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintFeeComponent } from './print-fee.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [PrintFeeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PrintFeeComponent,
            },
        ]),
        SharedModule,
    ],
})
export class PrintFeeModule {}
