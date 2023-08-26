import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoSingleComponent } from './smo-single.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SmoSingleComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: SmoSingleComponent,
            },
        ]),
    ],
})
export class SmoSingleModule {}
