import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraineeCertificateComponent } from './trainee-certificate.component';
import { RouterModule } from '@angular/router';
import { PrintFeeComponent } from '../print-fee/print-fee.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [TraineeCertificateComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: TraineeCertificateComponent,
            },
        ]),
        SharedModule,
    ],
})
export class TraineeCertificateModule {}
