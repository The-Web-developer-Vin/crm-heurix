import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LatestPaymentsComponent } from './latest-payments.component';
import { SharedModule } from 'app/shared/shared.module';

import { PaymentsWorkingComponent } from './payments-working/payments-working.component';

import { PaymentsCompletedComponent } from './payments-completed/payments-completed.component';
import { PaymentsStoppedComponent } from './payments-stopped/payments-stopped.component';
import { ViewBudgetComponent } from './view-budget/view-budget.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';

@NgModule({
    declarations: [
        LatestPaymentsComponent,

        PaymentsWorkingComponent,
        ViewBudgetComponent,
        PaymentsCompletedComponent,
        PaymentsStoppedComponent,
        AddPaymentComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: LatestPaymentsComponent,
            },
        ]),
        SharedModule,
    ],
})
export class LatestPaymentsModule {}
