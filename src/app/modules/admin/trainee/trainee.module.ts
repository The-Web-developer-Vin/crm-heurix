import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraineeComponent } from './trainee.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AddTraineeComponent } from './add-trainee/add-trainee.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { CompletedComponent } from './completed/completed.component';
import { EditStatusComponent } from './edit-status/edit-status.component';

@NgModule({
    declarations: [TraineeComponent, AddTraineeComponent, AddPaymentComponent, OngoingComponent, CompletedComponent, EditStatusComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: TraineeComponent,
            },
        ]),
        SharedModule,
    ],
})
export class TraineeModule {}
