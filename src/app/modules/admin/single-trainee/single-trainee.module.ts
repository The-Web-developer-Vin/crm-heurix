import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTraineeComponent } from './single-trainee.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [SingleTraineeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SingleTraineeComponent,
            },
        ]),
        SharedModule,
    ],
})
export class SingleTraineeModule {}
