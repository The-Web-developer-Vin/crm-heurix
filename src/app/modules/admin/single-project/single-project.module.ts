import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SingleProjectComponent } from './single-project.component';
import { SharedModule } from 'app/shared/shared.module';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';

@NgModule({
    declarations: [SingleProjectComponent, EditPaymentComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SingleProjectComponent,
            },
        ]),
        SharedModule,
    ],
})
export class SingleProjectModule {}
